// client/src/components/SocialRecovery.jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Shield, UserPlus, Key, ArrowLeft, Loader, Trash2, UserCheck, XCircle } from 'lucide-react';
import { ZeroAddress, isAddress } from 'ethers';

export default function SocialRecovery({ recoveryContract, onBack, walletAddress }) {
  const [guardians, setGuardians] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [newGuardian, setNewGuardian] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [activeRecovery, setActiveRecovery] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isGuardian, setIsGuardian] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [userHasApproved, setUserHasApproved] = useState(false);

  const fetchRecoveryState = async () => {
    if (!recoveryContract) return;
    setLoading(true);
    try {
      // CORRECTED: Call public state variables as functions with ()
      const [owner, guardianList, currentThreshold, recovery, isCallerGuardian, hasApproved] = await Promise.all([
        recoveryContract.currentOwner(),
        recoveryContract.getGuardians(),
        recoveryContract.recoveryThreshold(),
        recoveryContract.activeRecovery(),
        recoveryContract.isGuardian(walletAddress),
        recoveryContract.hasGuardianApproved(walletAddress)
      ]);
      
      setIsOwner(owner.toLowerCase() === walletAddress.toLowerCase());
      setIsGuardian(isCallerGuardian);
      setGuardians(guardianList);
      setThreshold(Number(currentThreshold));
      setUserHasApproved(hasApproved);

      if (recovery.newOwner !== ZeroAddress) {
        setActiveRecovery({
          newOwner: recovery.newOwner,
          approvalCount: Number(recovery.approvalCount),
          executionTime: Number(recovery.executionTime) === 0 ? null : new Date(Number(recovery.executionTime) * 1000),
        });
      } else {
        setActiveRecovery(null);
      }
    } catch (error) {
      console.error("Failed to fetch recovery state:", error);
      toast.error("Could not load recovery settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recoveryContract && walletAddress) {
        fetchRecoveryState();
    }
  }, [recoveryContract, walletAddress]);

  const handleTx = async (action, loadingKey, successMessage) => {
    setActionLoading(loadingKey);
    const toastId = toast.loading('Waiting for transaction...');
    try {
      const tx = await action();
      await tx.wait();
      toast.success(successMessage, { id: toastId });
      await fetchRecoveryState();
    } catch (err) {
      console.error(`Error with ${loadingKey}:`, err);
      toast.error(err.reason || 'Transaction failed.', { id: toastId });
    } finally {
      setActionLoading('');
    }
  };
  
  const handleAddGuardian = () => {
    if (!isAddress(newGuardian)) return toast.error('Invalid Ethereum address.');
    // NOTE: Your SocialRecovery.sol contract doesn't have `addGuardian`. 
    // This is a placeholder for when you add it.
    toast.error('Add Guardian function not yet implemented in the smart contract.');
    // handleTx(() => recoveryContract.addGuardian(newGuardian), 'add', 'Guardian added!');
    setNewGuardian('');
  };

  const handleRemoveGuardian = (guardianAddress) => {
    // NOTE: Your SocialRecovery.sol contract doesn't have `removeGuardian`.
    toast.error('Remove Guardian function not yet implemented in the smart contract.');
    // handleTx(() => recoveryContract.removeGuardian(guardianAddress), `remove-${guardianAddress}`, 'Guardian removed!');
  };

  const handleStartRecovery = () => {
    if (!isAddress(newOwner)) return toast.error('Invalid Ethereum address for new owner.');
    handleTx(() => recoveryContract.startRecovery(newOwner), 'start', 'Recovery initiated!');
  };

  const handleSupportRecovery = () => {
    handleTx(() => recoveryContract.supportRecovery(), 'support', 'Recovery supported!');
  };

  const handleCancelRecovery = () => {
    handleTx(() => recoveryContract.cancelRecovery(), 'cancel', 'Recovery cancelled!');
  };

  const handleExecuteRecovery = () => {
    handleTx(() => recoveryContract.executeRecovery(), 'execute', 'Recovery executed! Ownership transferred.');
  };

  if (loading) {
    return (
      <div className="info-card" style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spinner" /><p>Loading Recovery Settings...</p></div>
    );
  }

  return (
    <div className="form-container">
      <div className="info-card">
        <button onClick={onBack} className="btn-secondary" style={{ marginBottom: "2rem" }}><ArrowLeft size={20} /><span>Back to Profile</span></button>
        <h3><Shield size={20} /> Social Recovery Management</h3>
        <p>Manage trusted addresses (guardians) who can help recover your account if you lose access. A threshold of **{threshold} of {guardians.length}** guardians is required to approve a recovery.</p>

        {/* Guardian Management Section */}
        <div className="recovery-section">
          <h4>Guardians List</h4>
          <div className="guardian-list">
            {guardians.length > 0 ? guardians.map(g => (
              <div key={g} className="request-item">
                <span className="monospace">{g}</span>
                {isOwner && (
                  <button onClick={() => handleRemoveGuardian(g)} disabled={actionLoading.startsWith('remove')} className="btn-secondary reject">
                    {actionLoading === `remove-${g}` ? <Loader size={16} className="spinner"/> : <Trash2 size={16}/>}
                  </button>
                )}
              </div>
            )) : <div className="request-item"><p>No guardians added yet.</p></div>}
          </div>

          {isOwner && (
            <div className="form-group">
              <label>New Guardian Address</label>
              <div className="action-row">
                  <input type="text" value={newGuardian} onChange={(e) => setNewGuardian(e.target.value)} placeholder="Enter a trusted wallet address (0x...)" />
                  <button onClick={handleAddGuardian} disabled={actionLoading === 'add'} className="btn-secondary">
                    {actionLoading === 'add' ? <Loader size={16} className="spinner"/> : <UserPlus size={16}/>} <span>Add</span>
                  </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Recovery Section */}
        <div className="recovery-section">
          <h4>Account Recovery Status</h4>
          {activeRecovery ? (
            <div className="request-item">
              <p><strong>Recovery in Progress!</strong></p>
              <p>New Owner proposed: <span className="monospace">{activeRecovery.newOwner}</span></p>
              <p>Approvals: <strong>{activeRecovery.approvalCount} / {threshold}</strong></p>
              {activeRecovery.executionTime && activeRecovery.executionTime > new Date() && <p>Timelock ends: {activeRecovery.executionTime.toLocaleString()}</p>}
              <div className="request-actions">
                {isOwner && <button onClick={handleCancelRecovery} disabled={actionLoading === 'cancel'} className="btn-secondary reject">{actionLoading==='cancel' ? <Loader size={16} className="spinner"/> : <XCircle size={16}/>} Cancel</button>}
                {isGuardian && !userHasApproved && <button onClick={handleSupportRecovery} disabled={actionLoading === 'support'} className="btn-primary">{actionLoading==='support' ? <Loader size={16} className="spinner"/> : <UserCheck size={16}/>} Support</button>}
                {activeRecovery.executionTime && activeRecovery.executionTime <= new Date() && <button onClick={handleExecuteRecovery} disabled={actionLoading === 'execute'} className="btn-primary">{actionLoading==='execute' ? <Loader size={16} className="spinner"/> : <Key size={16}/>} Execute</button>}
              </div>
            </div>
          ) : (
            <p>No active recovery process.</p>
          )}
          {isGuardian && !isOwner && !activeRecovery && (
              <div className="form-group">
                <label>Start Recovery for New Owner</label>
                <div className="action-row">
                  <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="Enter the new wallet address" />
                  <button onClick={handleStartRecovery} disabled={actionLoading === 'start'} className="btn-primary">
                      {actionLoading === 'start' ? <Loader size={16} className="spinner"/> : <Key size={16}/>} <span>Start</span>
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}