import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './config';

function App() {
  // State variables for the DApp
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for the creation form
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // This function now also sets up the ethers contract instance
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        
        setAccount(address);
        setContract(contractInstance);

      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please consider installing it!");
    }
  };

  // Function to read data from the smart contract
  const getIdentity = async () => {
    if (contract) {
      try {
        const id = await contract.identities(account);
        // The contract returns an array-like object, check the 'isCreated' flag
        if (id.isCreated) {
          setIdentity({ name: id.name, email: id.email });
        }
      } catch (error) {
        console.error("Could not fetch identity:", error);
      }
    }
  };

  // Function to write data to the smart contract (create identity)
  const createIdentity = async () => {
    if (contract && nameInput && emailInput) {
      try {
        setLoading(true);
        console.log("Sending transaction to create identity...");
        const tx = await contract.createIdentity(nameInput, emailInput);
        
        // Wait for the transaction to be mined
        await tx.wait();
        console.log("Transaction mined!");
        
        // Refresh the identity data from the contract
        await getIdentity();
        setLoading(false);

      } catch (error) {
        console.error("Error creating identity:", error);
        setLoading(false);
      }
    }
  };

  // useEffect hook to automatically fetch identity when the user connects
  useEffect(() => {
    // Only run this if we have a connected account and a contract instance
    if (account && contract) {
      getIdentity();
    }
  }, [account, contract]); // The effect re-runs if 'account' or 'contract' changes


  // --- UI RENDERING --- //

  const renderContent = () => {
    if (!account) {
      return <button onClick={connectWallet}>Connect Wallet</button>;
    }

    if (loading) {
      return <p>Loading... Please wait.</p>;
    }

    if (identity) {
      return (
        <div>
          <h2>Your Digital Identity</h2>
          <p><strong>Name:</strong> {identity.name}</p>
          <p><strong>Email:</strong> {identity.email}</p>
        </div>
      );
    }

    return (
      <div>
        <h2>Create Your Identity</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ padding: '10px', margin: '5px', width: '200px' }}
        />
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          style={{ padding: '10px', margin: '5px', width: '200px' }}
        />
        <br /><br />
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