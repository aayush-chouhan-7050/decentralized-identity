import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI, sepoliaRpc } from './config';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Connect wallet and create contract instance using explicit Sepolia RPC
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access from MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Explicitly create a Sepolia JSON-RPC provider
        const rpcProvider = new ethers.JsonRpcProvider(sepoliaRpc);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        setAccount(await signer.getAddress());
        setContract(contractInstance);
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const getIdentity = async () => {
    if (contract && account) {
      try {
        const id = await contract.identities(account);
        if (id.isCreated) setIdentity({ name: id.name, email: id.email });
      } catch (err) {
        console.error("Fetch identity error:", err);
      }
    }
  };

  const createIdentity = async () => {
    if (!nameInput || !emailInput || !contract) return;
    try {
      setLoading(true);
      const tx = await contract.createIdentity(nameInput, emailInput);
      await tx.wait();
      await getIdentity();
      setLoading(false);
    } catch (err) {
      console.error("Create identity error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && contract) getIdentity();
  }, [account, contract]);

  const renderContent = () => {
    if (!account) return <button onClick={connectWallet}>Connect Wallet</button>;
    if (loading) return <p>Loading... Please wait.</p>;
    if (identity) return (
      <div>
        <h2>Your Digital Identity</h2>
        <p><strong>Name:</strong> {identity.name}</p>
        <p><strong>Email:</strong> {identity.email}</p>
      </div>
    );

    return (
      <div>
        <h2>Create Your Identity</h2>
        <input type="text" placeholder="Enter your name" value={nameInput} onChange={e => setNameInput(e.target.value)} style={{ padding: '10px', margin: '5px', width: '200px' }} /><br />
        <input type="email" placeholder="Enter your email" value={emailInput} onChange={e => setEmailInput(e.target.value)} style={{ padding: '10px', margin: '5px', width: '200px' }} /><br /><br />
        <button onClick={createIdentity}>Create</button>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Decentralized Identity</h1>
      {account && <p><strong>Connected:</strong> {account}</p>}
      <hr />
      {renderContent()}
    </div>
  );
}

export default App;
