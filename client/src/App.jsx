// src/App.jsx
import toast, { Toaster } from 'react-hot-toast';
import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useDisconnect } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Loader, ExternalLink, User, Sparkles } from 'lucide-react';

import { uploadProfileToIPFS, uploadFileToIPFS } from './services/ipfs';
import { contractAddress, contractABI, sepoliaRpc, projectId } from './config';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileViewer from './components/ProfileViewer';
import ProfileEditor from './components/ProfileEditor';
import HowToUse from './components/HowToUse'; // Import the new component

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
  const [view, setView] = useState('welcome'); // 'welcome', 'howToUse', 'app'

  const isNewProfile = useMemo(() => profile === null && isConnected, [profile, isConnected]);

  // --- Effects to manage contract and profile fetching ---
  useEffect(() => {
    if (isConnected && walletProvider) {
      const provider = new BrowserProvider(walletProvider);
      provider.getSigner().then(signer => {
        setContract(new Contract(contractAddress, contractABI, signer));
        setPublicKey(signer.address); // Public key is the wallet address
      });
    } else {
      setContract(null);
      setProfile(null);
      setPublicKey(null);
      localStorage.removeItem('userProfile');
      setLoading(false);
      setView('welcome');
    }
  }, [isConnected, walletProvider]);

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

  // --- Handlers ---
  const handleDisconnect = () => {
    disconnect();
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
        ...(profile || {}), // Start with the old profile data as a base
        ...dataToUpload,   // Overwrite it with all the new data from the form
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

  // --- Render Logic ---
  const renderContent = () => {
    if (view === 'howToUse') {
      return <HowToUse onBack={() => setView('welcome')} />;
    }

    if (!isConnected) {
      return <WelcomeScreen onConnect={() => open()} onHowToUse={() => setView('howToUse')} />;
    }

    // MODIFIED: Show loading screen if loading the initial profile OR if a transaction is processing
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
    
    if (profile) {
      return <ProfileViewer profile={profile} onEdit={() => setIsEditing(true)} publicKey={publicKey} walletAddress={address} pinataJwt={PINATA_JWT}/>;
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
      <Header isConnected={isConnected} address={address} onConnect={() => open()} onDisconnect={handleDisconnect} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}