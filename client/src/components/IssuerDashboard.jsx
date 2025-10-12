// src/components/IssuerDashboard.jsx
import { useState, useEffect } from 'react';
import { Mail, Check, X, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IssuerDashboard({ requestContract, address, onBack, onApproveAndIssue }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadRequests = async () => {
    if (!requestContract || !address) return;
    setLoading(true);
    try {
      const requestIds = await requestContract.getRequestsByIssuer(address);
      const requestPromises = requestIds.map(id => requestContract.requests(id));
      const fetchedRequests = await Promise.all(requestPromises);
      setRequests(fetchedRequests.filter(req => Number(req.status) === 0));
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [requestContract, address]);

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    const toastId = toast.loading('Rejecting request...');
    try {
      const tx = await requestContract.rejectRequest(requestId);
      await tx.wait();
      toast.success('Request rejected.', { id: toastId });
      loadRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
      toast.error('Failed to reject request.', { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="info-card">
      <button onClick={onBack} className="btn-secondary" style={{marginBottom: "2rem"}}><ArrowLeft size={20} /><span>Back to Profile</span></button>
      <h3><Mail size={20} /> Incoming Credential Requests</h3>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spinner" /></div>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="request-list">
          {requests.map(req => (
            <div key={req.id.toString()} className="request-item">
              <p><strong>From:</strong> <span className="monospace">{req.subject}</span></p>
              <p><strong>Type:</strong> {req.schemaName}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <div className="request-actions">
                <button 
                  className="btn-secondary reject" 
                  onClick={() => handleReject(req.id)}
                  disabled={actionLoading === req.id}
                >
                  {actionLoading === req.id ? <Loader size={16} className="spinner" /> : <X size={16} />}
                   Reject
                </button>
                <button 
                  className="btn-primary approve"
                  onClick={() => onApproveAndIssue(req)}
                >
                  <Check size={16} /> Approve & Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}