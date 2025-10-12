// client/src/components/SetupRecovery.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, UserPlus, ArrowLeft, Loader, Trash2 } from 'lucide-react';
import { ContractFactory, isAddress } from 'ethers';
import { socialRecoveryContractABI, socialRecoveryContractBytecode } from '../config';

export default function SetupRecovery({ onBack, provider, identityContract }) {
  const [guardians, setGuardians] = useState([]);
  const [newGuardian, setNewGuardian] = useState('');
  const [threshold, setThreshold] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddGuardian = () => {
    if (!isAddress(newGuardian)) {
      return toast.error("Invalid Ethereum address.");
    }
    if (guardians.find(g => g.toLowerCase() === newGuardian.toLowerCase())) {
      return toast.error("Guardian already added.");
    }
    setGuardians([...guardians, newGuardian]);
    setNewGuardian('');
  };

  const handleRemoveGuardian = (addressToRemove) => {
    setGuardians(guardians.filter(g => g !== addressToRemove));
  };

  const handleDeployAndSetup = async () => {
    if (threshold <= 0 || guardians.length < threshold) {
      return toast.error(`Threshold must be at least 1 and not more than the number of guardians.`);
    }
    setLoading(true);
    const toastId = toast.loading('Preparing to deploy your personal recovery contract...');

    try {
      const signer = await provider.getSigner();
      const identityContractAddress = await identityContract.getAddress();

      // 1. Deploy the new SocialRecovery contract from the browser
      toast.loading('1/2: Deploying contract... Please confirm in your wallet.', { id: toastId });
      const factory = new ContractFactory(socialRecoveryContractABI, socialRecoveryContractBytecode, signer);
      const recoveryContract = await factory.deploy(identityContractAddress, guardians, threshold);
      await recoveryContract.waitForDeployment();
      const recoveryContractAddress = recoveryContract.target;
      toast.loading(`2/2: Linking recovery contract (${recoveryContractAddress.slice(0,6)}...) to your identity...`, { id: toastId });

      // 2. Tell the main Identity contract that this new contract is now the owner
      const tx = await identityContract.setOwner(recoveryContractAddress);
      await tx.wait();

      toast.success('Social Recovery has been successfully activated!', { id: toastId });
      onBack(); // Go back to the profile page to see the changes

    } catch (err) {
      console.error("Failed to deploy recovery contract:", err);
      let errorMessage = "Setup failed.";
      if (err.code === 'ACTION_REJECTED') {
          errorMessage = "Transaction rejected by user.";
      } else if (err.reason) {
          errorMessage = err.reason;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="info-card">
        <button onClick={onBack} className="btn-secondary" style={{ marginBottom: "2rem" }} disabled={loading}>
          <ArrowLeft size={20} /><span>Back to Profile</span>
        </button>
        <h3><Shield size={20} /> Activate Social Recovery</h3>
        <p>Deploy a personal smart contract to manage your identity. Add trusted "guardians" who can help you recover access if you lose your wallet.</p>

        <div className="recovery-section">
          <h4>1. Add Guardians</h4>
          <div className="guardian-list">
            {guardians.length > 0 ? guardians.map(g => (
              <div key={g} className="request-item">
                <span className="monospace">{g}</span>
                <button onClick={() => handleRemoveGuardian(g)} className="btn-secondary reject" disabled={loading}><Trash2 size={16}/></button>
              </div>
            )) : <div className="request-item"><p>Add your first guardian below.</p></div>}
          </div>
          <div className="form-group">
            <label>New Guardian Address</label>
            <div className="action-row">
              <input type="text" value={newGuardian} onChange={(e) => setNewGuardian(e.target.value)} placeholder="Enter a trusted wallet address (0x...)" />
              <button onClick={handleAddGuardian} className="btn-secondary" disabled={loading}><UserPlus size={16}/><span>Add</span></button>
            </div>
          </div>
        </div>

        <div className="recovery-section">
          <h4>2. Set Recovery Threshold</h4>
          <p>The minimum number of guardians required to approve a recovery request.</p>
          <div className="form-group">
            <label>Required Approvals</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))} min="1" max={guardians.length || 1} disabled={loading} />
          </div>
        </div>
        
        <div className="credential-actions">
            <button onClick={handleDeployAndSetup} className="btn-primary" disabled={loading || guardians.length === 0}>
                {loading ? <Loader size={20} className="spinner" /> : <Shield size={20} />}
                <span>Deploy & Activate</span>
            </button>
        </div>
      </div>
    </div>
  );
}