// src/App.jsx
import toast, { Toaster } from 'react-hot-toast';
import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useDisconnect } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Loader, ExternalLink, User, Sparkles, Mail } from 'lucide-react';
import { uploadProfileToIPFS, uploadFileToIPFS } from './services/ipfs';
import { contractAddress, contractABI, sepoliaRpc, projectId, credentialContractAddress, credentialContractABI, credentialRequestAddress, credentialRequestABI } from './config';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileViewer from './components/ProfileViewer';
import ProfileEditor from './components/ProfileEditor';
import HowToUse from './components/HowToUse'; 
import IssueCredential from './components/IssueCredential';
import RequestCredential from './components/RequestCredential';
import IssuerDashboard from './components/IssuerDashboard';

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

// --- Main App Component ---
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export default function App() {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [contract, setContract] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [credentialContract, setCredentialContract] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [isIssuer, setIsIssuer] = useState(false);
  const [requestContract, setRequestContract] = useState(null);
  const [view, setView] = useState('welcome');
  const [requestToIssue, setRequestToIssue] = useState(null);
  const [refreshCredentials, setRefreshCredentials] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const isNewProfile = useMemo(() => profile === null && isConnected, [profile, isConnected]);

  // --- Effects to manage contract and profile fetching ---
  useEffect(() => {
    if (isConnected && walletProvider) {
      const provider = new BrowserProvider(walletProvider);
      // Add 'async' here
      provider.getSigner().then(async (signer) => { 
        setContract(new Contract(contractAddress, contractABI, signer));
        setPublicKey(signer.address);

        const registryContract = new Contract(credentialContractAddress, credentialContractABI, signer);
        setCredentialContract(registryContract);
        const reqContract = new Contract(credentialRequestAddress, credentialRequestABI, signer);
        setRequestContract(reqContract);

        try {
            const issuerInfo = await registryContract.issuers(address); 
            if (issuerInfo.isIssuer) {
                setIsIssuer(true);
            } else {
                setIsIssuer(false);
            }
        } catch (error) {
            console.error("Could not check issuer status:", error);
            setIsIssuer(false);
        }
      });
    } else {
      setContract(null);
      setProfile(null);
      setPublicKey(null);
      localStorage.removeItem('userProfile');
      setLoading(false);
      setView('welcome');
      setCredentialContract(null);
      setCredentials([]);
      setIsIssuer(false);
    }
  }, [isConnected, walletProvider, address]);

  useEffect(() => {
    const getProfile = async () => {
      if (contract && address) {
        setLoading(true);
        setView('app');
        try {
          const id = await contract.identities(address);

          if (id.isCreated) {
            let cachedProfile = null;
            try {
              cachedProfile = JSON.parse(localStorage.getItem('userProfile'));
              if (cachedProfile && cachedProfile.did !== `did:ethr:${address}`) {
                localStorage.removeItem('userProfile'); 
                cachedProfile = null;
              }
            } catch (e) { console.warn("Could not parse cached profile.", e); }

            if (cachedProfile && cachedProfile.ipfsCid === id.ipfsHash) {
              setProfile(cachedProfile);
            } else {
              const DEDICATED_GATEWAY_URL = import.meta.env.VITE_DEDICATED_GATEWAY_URL;
              const url = `${DEDICATED_GATEWAY_URL}/ipfs/${id.ipfsHash}?pinataGatewayToken=${PINATA_JWT}`;
              
              const response = await axios.get(url);
              const newProfileData = { ...response.data, did: `did:ethr:${address}`, ipfsCid: id.ipfsHash };
              setProfile(newProfileData);
              localStorage.setItem('userProfile', JSON.stringify(newProfileData));
            }
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Could not fetch profile:", err);
          toast.error('Failed to fetch profile.');
          setProfile(null);
          localStorage.removeItem('userProfile');
        } finally {
          setLoading(false);
        }
      }
    };
    getProfile();
  }, [contract, address]);

  useEffect(() => {
    const fetchCredentials = async () => {
      if (credentialContract && address) {
        setLoading(true);
        try {
          const issuedFilter = credentialContract.filters.CredentialIssued(null, null, address);
          const issuedEvents = await credentialContract.queryFilter(issuedFilter);
          
          const userCredentials = await Promise.all(issuedEvents.map(async (event) => {
            const cred = await credentialContract.credentials(event.args.credentialId);
            const [revoked, expired] = await credentialContract.getCredentialStatus(event.args.credentialId);
            
            const credentialUrl = `${import.meta.env.VITE_DEDICATED_GATEWAY_URL}/ipfs/${cred.ipfsHash}?pinataGatewayToken=${PINATA_JWT}`;

            let credentialName = 'Unnamed Credential';
            try {
              const response = await axios.get(credentialUrl);
              credentialName = response.data?.credentialSubject?.degree?.name || credentialName;
            } catch (e) {
              console.warn(`Could not fetch credential data for hash: ${cred.ipfsHash}`, e);
            }

            return {
              credentialId: event.args.credentialId,
              name: credentialName,
              schemaId: ethers.decodeBytes32String(event.args.schemaId),
              issuer: cred.issuer,
              ipfsHash: cred.ipfsHash,
              url: credentialUrl,
              revoked,
              expired,
            };
          }));

          setCredentials(userCredentials);
        } catch (error) {
          console.error("Could not fetch credentials:", error);
          toast.error("Failed to load your credentials.");
        } finally {
            setLoading(false);
        }
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
      const { firstName, middleName, lastName } = validatedProfileData;
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
      const dataToUpload = { ...validatedProfileData };
      const fileUploadPromises = [];
      const fileKeys = ['profilePhoto', 'documentFile', 'resume'];

      fileKeys.forEach(key => {
        if (dataToUpload[key] instanceof FileList && dataToUpload[key].length > 0) {
          fileUploadPromises.push(
            uploadFileToIPFS(dataToUpload[key][0]).then(url => ({ key, url }))
          );
        }
      });
      
      if (fileUploadPromises.length > 0) {
        toast.loading(`Uploading ${fileUploadPromises.length} file(s)...`, { id: toastId });
        const uploadedFiles = await Promise.all(fileUploadPromises);
        uploadedFiles.forEach(({ key, url }) => {
          dataToUpload[key] = url;
        });
      }
      
      toast.loading('Saving profile data to IPFS...', { id: toastId });
      
      const fullProfileData = {
        ...(profile || {}),
        ...dataToUpload,   
        fullName,
        did: `did:ethr:${address}`,
        updatedAt: new Date().toISOString(),
      };
      
      const ipfsHash = await uploadProfileToIPFS(fullProfileData);
      
      toast.loading('Waiting for transaction confirmation...', { id: toastId });
      
      const tx = await (isNewProfile ? contract.createIdentity(ipfsHash) : contract.updateIdentity(ipfsHash));
      
      setTxHash(tx.hash);
      await tx.wait();
      
      const newProfileState = {
        ...fullProfileData,
        ipfsCid: ipfsHash,
      };
      setProfile(newProfileState);
      localStorage.setItem('userProfile', JSON.stringify(newProfileState));
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
      console.error("Error submitting profile:", err);
      let errorMessage = 'Failed to submit profile.';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected by user.';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction.';
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
      console.error("Failed to revoke credential:", err);
      let errorMessage = 'Revocation failed.';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected.';
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setRevokingId(null);
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (view === 'howToUse') {
      return <HowToUse onBack={() => setView('welcome')} />;
    }

    if (!isConnected) {
      return <WelcomeScreen onConnect={() => open()} onHowToUse={() => setView('howToUse')} />;
    }
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
            onCredentialIssued={() => {
                setView('app');
                setRequestToIssue(null);
                setRefreshCredentials(prev => !prev);
            }} 
            onCancel={() => {
                setView('app');
                setRequestToIssue(null);
            }}
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

    if (view === 'requestCredential') {
        return <RequestCredential requestContract={requestContract} onCancel={() => setView('app')} onRequested={() => setView('app')} />;
    }

    if (view === 'issuerDashboard') {
    return <IssuerDashboard 
        requestContract={requestContract} 
        address={address} 
        onBack={() => setView('app')} 
        onApproveAndIssue={handleApproveAndIssue} 
    />;
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
            />
        </>
      );
    }

    if(isConnected && !isNewProfile && !loading) {
      return (
        <div className="no-identity-screen">
          <div className="no-identity-icon"><User size={80} /></div>
          <h2>No Identity Found</h2>
          <p>Create your decentralized identity to get started.</p>
          <button onClick={() => setIsEditing(true)} className="btn-primary btn-large"><Sparkles size={24} /><span>Create Your Identity</span></button>
        </div>
      );
    }
    if (isConnected && !profile && !loading) {
    return (
      <div className="no-identity-screen">
        <div className="no-identity-icon"><User size={80} /></div>
        <h2>No Identity Found</h2>
        <p>You're connected, but you haven't created an identity yet. Create your decentralized identity to get started.</p>
        <button onClick={() => setIsEditing(true)} className="btn-primary btn-large">
          <Sparkles size={24} />
          <span>Create Your Identity</span>
        </button>
      </div>
    );
  }

    return <WelcomeScreen onConnect={() => open()} onHowToUse={() => setView('howToUse')} />;
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" gutter={12} toastOptions={{ duration: 5000, style: { background: 'rgba(25, 30, 45, 0.9)', color: '#e4e7eb', border: '1.5px solid rgba(100, 108, 255, 0.25)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', padding: '16px 24px' }, success: { iconTheme: { primary: '#22c55e', secondary: '#0a0e1a' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' }}}}/>
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