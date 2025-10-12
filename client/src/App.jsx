// client/src/App.jsx
import toast, { Toaster } from 'react-hot-toast';
import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useDisconnect } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import { ethers as ethersLib } from 'ethers';
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Loader, ExternalLink, User, Sparkles, Mail } from 'lucide-react';
import { uploadProfileToIPFS, uploadFileToIPFS } from './services/ipfs';
import {
  contractAddress,
  contractABI,
  sepoliaRpc,
  projectId,
  credentialContractAddress,
  credentialContractABI,
  credentialRequestAddress,
  credentialRequestABI,
  socialRecoveryContractABI
} from './config';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileViewer from './components/ProfileViewer';
import ProfileEditor from './components/ProfileEditor';
import HowToUse from './components/HowToUse';
import IssueCredential from './components/IssueCredential';
import RequestCredential from './components/RequestCredential';
import IssuerDashboard from './components/IssuerDashboard';
import SocialRecovery from './components/SocialRecovery';
import SetupRecovery from './components/SetupRecovery';
import { encryptData, decryptData } from './services/encryption';

// --- Web3Modal Configuration ---
const sepolia = { chainId: 11155111, name: 'Sepolia', currency: 'SEP', explorerUrl: 'https://sepolia.etherscan.io', rpcUrl: sepoliaRpc };
const metadata = { name: 'DecentraID', description: 'A dApp for managing a decentralized identity.', url: 'https://decentraid.aayushchouhan.com/', icons: ['https://avatars.githubusercontent.com/u/37784886'] };

createWeb3Modal({
  ethersConfig: { metadata, defaultChainId: 11155111, rpcUrl: sepoliaRpc },
  chains: [sepolia],
  projectId,
  themeMode: 'dark',
  themeVariables: { '--w3m-accent': '#646cff', '--w3m-border-radius-master': '12px' }
});

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const DEDICATED_GATEWAY_URL = import.meta.env.VITE_DEDICATED_GATEWAY_URL || 'https://gateway.pinata.cloud';

export default function App() {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Core UI state
  const [view, setView] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState(null);

  // Profile & identity
  const [profile, setProfile] = useState(null);
  const isNewProfile = useMemo(() => profile === null && isConnected, [profile, isConnected]);

  // Provider & contract instances
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null); // main identity contract
  const [credentialContract, setCredentialContract] = useState(null);
  const [requestContract, setRequestContract] = useState(null);
  const [userRecoveryContract, setUserRecoveryContract] = useState(null);

  // Feature-specific state
  const [isEditing, setIsEditing] = useState(false);
  const [isIssuer, setIsIssuer] = useState(false);
  const [isRecoveryActive, setIsRecoveryActive] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [revokingId, setRevokingId] = useState(null);
  const [requestToIssue, setRequestToIssue] = useState(null);

  // Additional helpers / flags
  const [publicKey, setPublicKey] = useState(null);
  const [refreshCredentials, setRefreshCredentials] = useState(false);

  // --- Unified initialization: fetch & set all on connect ---
  const fetchAndSetAllState = useCallback(async () => {
    // Reset if disconnected
    if (!isConnected || !walletProvider) {
      setProvider(null);
      setContract(null);
      setCredentialContract(null);
      setRequestContract(null);
      setUserRecoveryContract(null);
      setProfile(null);
      setCredentials([]);
      setIsIssuer(false);
      setIsRecoveryActive(false);
      setPublicKey(null);
      localStorage.removeItem('userProfile');
      setLoading(false);
      setView('welcome');
      return;
    }

    setLoading(true);
    try {
      const browserProvider = new BrowserProvider(walletProvider);
      setProvider(browserProvider);
      const signer = await browserProvider.getSigner();

      // set public key if available
      try {
        const signerAddress = await signer.getAddress();
        setPublicKey(signerAddress);
      } catch (e) {
        setPublicKey(null);
      }

      // instantiate main contracts with signer
      const mainContract = new Contract(contractAddress, contractABI, signer);
      setContract(mainContract);

      const credContract = new Contract(credentialContractAddress, credentialContractABI, signer);
      setCredentialContract(credContract);

      const reqContract = new Contract(credentialRequestAddress, credentialRequestABI, signer);
      setRequestContract(reqContract);

      // --- 1) Check for on-chain identity and load profile (with caching) ---
      try {
        const id = await mainContract.identities(address);

        if (id.isCreated) {
          // Cached load optimization
          let cachedProfile = null;
          try {
            cachedProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (cachedProfile && cachedProfile.did !== `did:ethr:${address}`) {
              cachedProfile = null;
              localStorage.removeItem('userProfile');
            }
          } catch (e) {
            cachedProfile = null;
          }

          if (cachedProfile && cachedProfile.ipfsCid === id.ipfsHash) {
            setProfile(cachedProfile);
          } else {
            const gatewayUrl = PINATA_JWT ? `${DEDICATED_GATEWAY_URL}` : 'https://gateway.pinata.cloud';
            const url = `${gatewayUrl}/ipfs/${id.ipfsHash}${PINATA_JWT ? `?pinataGatewayToken=${PINATA_JWT}` : ''}`;

            const response = await axios.get(url);
            const decryptedProfile = await decryptData(JSON.stringify(response.data), signer);
            const newProfileData = { ...decryptedProfile, did: `did:ethr:${address}`, ipfsCid: id.ipfsHash };
            setProfile(newProfileData);
            try {
              localStorage.setItem('userProfile', JSON.stringify(newProfileData));
            } catch (e) {
              console.warn('Could not cache profile to localStorage', e);
            }
          }
        } else {
          setProfile(null);
          localStorage.removeItem('userProfile');
        }
      } catch (err) {
        console.warn('Profile fetch/decrypt failed:', err);
        setProfile(null);
        localStorage.removeItem('userProfile');
      }

      // --- 2) Check social recovery: owner mapping points to recovery contract address if active ---
      try {
        const ownerAddr = await mainContract.owners(address);
        if (ownerAddr && ownerAddr.toLowerCase() !== address.toLowerCase()) {
          setIsRecoveryActive(true);
          const recoveryContractInstance = new Contract(ownerAddr, socialRecoveryContractABI, signer);
          setUserRecoveryContract(recoveryContractInstance);
        } else {
          setIsRecoveryActive(false);
          setUserRecoveryContract(null);
        }
      } catch (err) {
        console.warn('Recovery check failed:', err);
        setIsRecoveryActive(false);
        setUserRecoveryContract(null);
      }

      // --- 3) Check issuer status on credential registry ---
      try {
        const issuerInfo = await credContract.issuers(address);
        setIsIssuer(!!issuerInfo?.isIssuer);
      } catch (err) {
        console.warn('Issuer check failed:', err);
        setIsIssuer(false);
      }

      // Set view to app
      setView('app');
    } catch (err) {
      console.error('Error during initial state setup:', err);
      toast.error('Failed to load on-chain data.');
      // keep user in app if connected but failed parts
      setView(isConnected ? 'app' : 'welcome');
    } finally {
      setLoading(false);
    }
  }, [isConnected, walletProvider, address]);

  useEffect(() => {
    fetchAndSetAllState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, walletProvider, address, fetchAndSetAllState]);

  // --- Credentials fetch (separate effect, refreshable) ---
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!credentialContract || !address) return;
      setLoading(true);
      try {
        // filter for credentials issued to this user (subject)
        const issuedFilter = credentialContract.filters.CredentialIssued(null, null, address);
        const events = await credentialContract.queryFilter(issuedFilter);

        const userCredentials = await Promise.all(events.map(async (ev) => {
          const cred = await credentialContract.credentials(ev.args.credentialId);
          // try to read status if contract exposes it
          let revoked = false, expired = false;
          try {
            const status = await credentialContract.getCredentialStatus(ev.args.credentialId);
            // status may be a tuple or booleans depending on contract
            if (Array.isArray(status)) {
              revoked = !!status[0];
              expired = !!status[1];
            } else if (typeof status === 'object' && status !== null) {
              revoked = !!status.revoked;
              expired = !!status.expired;
            }
          } catch (e) {
            // if contract doesn't implement getCredentialStatus, ignore
            console.warn('getCredentialStatus not available or failed', e);
          }

          const credentialUrl = `${DEDICATED_GATEWAY_URL}/ipfs/${cred.ipfsHash}${PINATA_JWT ? `?pinataGatewayToken=${PINATA_JWT}` : ''}`;

          let credentialName = 'Unnamed Credential';
          try {
            const resp = await axios.get(credentialUrl);
            credentialName = resp.data?.credentialSubject?.degree?.name || resp.data?.credentialSubject?.name || credentialName;
          } catch (e) {
            console.warn('Could not fetch credential JSON:', e);
          }

          let schemaName = '';
          try {
            // event.args.schemaId may be bytes32; parse to string
            schemaName = ev.args?.schemaId ? ethersLib.utils.parseBytes32String(ev.args.schemaId) : '';
          } catch (e) {
            schemaName = '';
          }

          return {
            credentialId: ev.args.credentialId,
            name: credentialName,
            schemaId: schemaName,
            issuer: cred.issuer,
            ipfsHash: cred.ipfsHash,
            url: credentialUrl,
            revoked,
            expired,
          };
        }));

        setCredentials(userCredentials);
      } catch (err) {
        console.error('Could not fetch credentials:', err);
        toast.error('Failed to load credentials.');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [credentialContract, address, refreshCredentials]);

  // --- Handlers ---
  const handleDisconnect = () => {
    disconnect();
  };

  const handleApproveAndIssue = (request) => {
    setRequestToIssue({
      subject: request.subject,
      schemaName: request.schemaName,
      requestId: request.id
    });
    setView('issueCredential');
  };

  const handleSubmitProfile = async (validatedProfileData) => {
    setLoading(true);
    const toastId = toast.loading('Preparing profile data...');
    try {
      // Ensure provider exists (should be set by initialization)
      const browserProvider = provider || new BrowserProvider(walletProvider);
      const signer = await browserProvider.getSigner();

      const { firstName, middleName, lastName } = validatedProfileData;
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const dataToUpload = { ...validatedProfileData };
      const fileKeys = ['profilePhoto', 'documentFile', 'resume'];
      const fileUploadPromises = fileKeys
        .filter(key => dataToUpload[key] instanceof FileList && dataToUpload[key].length > 0)
        .map(key => uploadFileToIPFS(dataToUpload[key][0]).then(url => ({ key, url })));

      if (fileUploadPromises.length > 0) {
        toast.loading(`Uploading ${fileUploadPromises.length} file(s)...`, { id: toastId });
        const uploadedFiles = await Promise.all(fileUploadPromises);
        uploadedFiles.forEach(({ key, url }) => { dataToUpload[key] = url; });
      }

      const fullProfileData = {
        ...(profile || {}),
        ...dataToUpload,
        fullName,
        did: `did:ethr:${address}`,
        updatedAt: new Date().toISOString()
      };

      toast.loading('Encrypting profile data...', { id: toastId });
      const encryptedData = await encryptData(fullProfileData, signer);

      toast.loading('Saving encrypted profile to IPFS...', { id: toastId });
      const ipfsHash = await uploadProfileToIPFS(encryptedData);

      toast.loading('Waiting for transaction confirmation...', { id: toastId });

      let tx;
      if (isNewProfile) {
        tx = await contract.createIdentity(ipfsHash);
      } else {
        if (isRecoveryActive && userRecoveryContract) {
          tx = await userRecoveryContract.updateIdentity(ipfsHash);
        } else {
          tx = await contract.updateIdentity(ipfsHash);
        }
      }

      setTxHash(tx.hash);
      await tx.wait();

      const newProfileState = { ...fullProfileData, ipfsCid: ipfsHash };
      setProfile(newProfileState);
      try { localStorage.setItem('userProfile', JSON.stringify(newProfileState)); } catch (e) { /* ignore */ }
      setIsEditing(false);

      toast.success(
        (t) => (
          <span style={{ textAlign: 'center' }}>
            Identity saved successfully!
            <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
               style={{ display: 'block', marginTop: '4px', color: '#a5b4fc', textDecoration: 'underline' }}>
              View on Etherscan
            </a>
          </span>
        ), { id: toastId }
      );

    } catch (err) {
      console.error('Error submitting profile:', err);
      let errorMessage = 'Failed to submit profile.';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected by user.';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction.';
      } else if (err.reason) {
        errorMessage = err.reason;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
      setTxHash(null);
    }
  };

  const handleRevokeCredential = async (credentialId) => {
    if (!credentialContract) return;
    setRevokingId(credentialId);
    const toastId = toast.loading('Submitting revocation transaction...');
    try {
      const tx = await credentialContract.revokeCredential(credentialId);
      await tx.wait();
      toast.success('Credential revoked successfully!', { id: toastId });
      setRefreshCredentials(prev => !prev);
    } catch (err) {
      console.error('Failed to revoke credential:', err);
      let errorMessage = 'Revocation failed.';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected.';
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setRevokingId(null);
    }
  };

  // --- Render helpers ---
  const renderContent = () => {
    if (view === 'howToUse') return <HowToUse onBack={() => setView('app')} />;

    if (!isConnected) return <WelcomeScreen onConnect={() => open()} onHowToUse={() => setView('howToUse')} />;

    if (loading && (!profile || txHash)) {
      return (
        <div className="loading-screen">
          <Loader size={64} className="spinner" />
          <h2>{txHash ? 'Processing Transaction' : 'Loading Identity...'}</h2>
          {txHash && (
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
              View Transaction <ExternalLink size={16} />
            </a>
          )}
        </div>
      );
    }

    if (view === 'issueCredential') {
      return (
        <div className="form-container">
          <IssueCredential
            contract={credentialContract}
            requestContract={requestContract}
            issuerAddress={address}
            prefillData={requestToIssue}
            onCredentialIssued={() => { setView('app'); setRequestToIssue(null); setRefreshCredentials(prev => !prev); }}
            onCancel={() => { setView('app'); setRequestToIssue(null); }}
          />
        </div>
      );
    }

    if (isEditing) {
      return (
        <ProfileEditor
          existingProfile={profile}
          onSubmit={handleSubmitProfile}
          onCancel={() => setIsEditing(false)}
          loading={!!txHash}
          isNewProfile={isNewProfile}
        />
      );
    }

    if (view === 'setupRecovery') {
      return <SetupRecovery onBack={() => { setView('app'); fetchAndSetAllState(); }} provider={provider} identityContract={contract} />;
    }

    if (view === 'socialRecovery') {
      return <SocialRecovery recoveryContract={userRecoveryContract} onBack={() => setView('app')} walletAddress={address} />;
    }

    if (view === 'requestCredential') {
      return <RequestCredential requestContract={requestContract} onCancel={() => setView('app')} onRequested={() => setView('app')} />;
    }

    if (view === 'issuerDashboard') {
      return <IssuerDashboard requestContract={requestContract} address={address} onBack={() => setView('app')} onApproveAndIssue={handleApproveAndIssue} />;
    }

    if (profile) {
      return (
        <>
          <div className="top-actions">
            <button onClick={() => setView('requestCredential')} className="btn-secondary">
              <Mail size={16} />
              <span>Request a Credential</span>
            </button>
            {isIssuer && (
              <button onClick={() => setView('issuerDashboard')} className="btn-primary">
                <Mail size={16} />
                <span>View Requests</span>
              </button>
            )}
          </div>
          <ProfileViewer
            profile={profile}
            onEdit={() => setIsEditing(true)}
            publicKey={publicKey}
            walletAddress={address}
            pinataJwt={PINATA_JWT}
            credentials={credentials}
            onRevokeCredential={handleRevokeCredential}
            revokingId={revokingId}
            isRecoveryActive={isRecoveryActive}
            onSetupRecovery={() => setView('setupRecovery')}
            onManageRecovery={() => setView('socialRecovery')}
          />
        </>
      );
    }

    // connected but no profile
    return (
      <div className="no-identity-screen">
        <div className="no-identity-icon"><User size={80} /></div>
        <h2>No Identity Found</h2>
        <p>{isConnected ? "You're connected, but you haven't created an identity yet. Create your decentralized identity to get started." : 'Create your decentralized identity to get started.'}</p>
        <button onClick={() => setIsEditing(true)} className="btn-primary btn-large">
          <Sparkles size={24} />
          <span>Create Your Identity</span>
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'rgba(25, 30, 45, 0.9)',
            color: '#e4e7eb',
            border: '1.5px solid rgba(100, 108, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            padding: '16px 24px'
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0a0e1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' } }
        }}
      />
      <div className="bg-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <Header isConnected={isConnected} address={address} onConnect={() => open()} onDisconnect={handleDisconnect} isIssuer={isIssuer} onIssueCredential={() => setView('issueCredential')} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
