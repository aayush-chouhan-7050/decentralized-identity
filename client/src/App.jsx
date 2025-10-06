import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import { useState, useEffect } from 'react';
import { contractAddress, contractABI, sepoliaRpc, projectId } from './config';

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'SEP',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: sepoliaRpc 
};

const metadata = {
  name: 'Decentralized Identity',
  description: 'A dApp for creating a decentralized identity on the blockchain.',
  url: 'https://decentralized-identity-orcin.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

createWeb3Modal({
  ethersConfig: {
    metadata,
    defaultChainId: 11155111,
    rpcUrl: 'https://cloudflare-eth.com'
  },
  chains: [sepolia],
  projectId,
  enableAnalytics: true
});

function App() {
  // Web3Modal Hooks
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Your DApp's state
  const [contract, setContract] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isIdentityFetched, setIsIdentityFetched] = useState(false);


  // Effect to create contract instance when connected
  useEffect(() => {
    const setupContract = async () => {
      if (isConnected && walletProvider) {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
      } else {
        setContract(null);
        setIdentity(null);
        setIsIdentityFetched(false);
      }
    };
    setupContract();
  }, [isConnected, walletProvider]);

  // Effect to fetch identity once when the contract is ready
  useEffect(() => {
    const getIdentity = async () => {
      if (contract && address && !isIdentityFetched) {
        try {
          console.log("Fetching identity for:", address);
          const id = await contract.identities(address);
          if (id.isCreated) {
            setIdentity({ name: id.name, email: id.email });
          }
          setIsIdentityFetched(true); // Mark as fetched
        } catch (err) {
          console.error("Fetch identity error:", err);
        }
      }
    };
    getIdentity();
  }, [contract, address, isIdentityFetched]);


  const createIdentity = async () => {
    if (!nameInput || !emailInput || !contract) return;
    try {
      setLoading(true);
      const tx = await contract.createIdentity(nameInput, emailInput);
      await tx.wait();
      // Refetch identity after creation
      const id = await contract.identities(address);
      if (id.isCreated) setIdentity({ name: id.name, email: id.email });
      setLoading(false);
    } catch (err) {
      console.error("Create identity error:", err);
      setLoading(false);
      alert("Failed to create identity. See console for details.");
    }
  };

  const renderContent = () => {
    if (!isConnected) {
      return <button onClick={() => open()}>Connect Wallet</button>;
    }

    if (loading) return <p>Loading... Please wait.</p>;

    if (identity && identity.name) {
      return (
        <div>
          <h2>Your Digital Identity</h2>
          <p><strong>Name:</strong> {identity.name}</p>
          <p><strong>Email:</strong> {identity.email}</p>
        </div>
      );
    }

    // Only show create form if identity is fetched and doesn't exist
    if (isIdentityFetched && !identity) {
        return (
          <div>
            <h2>Create Your Identity</h2>
            <input type="text" placeholder="Enter your name" value={nameInput} onChange={e => setNameInput(e.target.value)} style={{ padding: '10px', margin: '5px', width: '200px' }} /><br />
            <input type="email" placeholder="Enter your email" value={emailInput} onChange={e => setEmailInput(e.target.value)} style={{ padding: '10px', margin: '5px', width: '200px' }} /><br /><br />
            <button onClick={createIdentity}>Create</button>
          </div>
        );
    }
    
    return <p>Checking for your identity...</p>;
  };

  return (
    <div className="App">
      <h1>Decentralized Identity</h1>
      {isConnected && (
        <div>
          <p><strong>Connected:</strong> {address}</p>
          <button onClick={() => open({ view: 'Account' })}>Account</button>
        </div>
      )}
      <hr />
      {renderContent()}
    </div>
  );
}

export default App;