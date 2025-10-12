// src/components/RequestCredential.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Send, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestCredential({ requestContract, onCancel, onRequested }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Submitting your request...');
    try {
      const tx = await requestContract.createRequest(data.issuer, data.schemaName, data.reason);
      await tx.wait();
      toast.success('Request submitted successfully!', { id: toastId });
      onRequested();
    } catch (err) {
      console.error("Failed to create request:", err);
      toast.error('Failed to submit request.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
        <div className="info-card">
            <h3><Mail size={20} /> Request a Credential</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Issuer Address</label>
                        <input type="text" {...register('issuer', { required: true })} placeholder="0x..." />
                    </div>
                    <div className="form-group">
                        <label>Credential Type</label>
                        <input type="text" {...register('schemaName', { required: true })} placeholder="e.g., UniversityDegreeCredential" />
                    </div>
                    <div className="form-group full-width">
                        <label>Reason for Request</label>
                        <textarea {...register('reason', { required: true })} rows={4}></textarea>
                    </div>
                </div>
                <div className="credential-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}><X size={20} /><span>Cancel</span></button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <Loader size={20} className="spinner" /> : <Send size={20} />}
                        <span>Submit Request</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}