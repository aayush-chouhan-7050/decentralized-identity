// src/components/IssueCredential.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Award, User, Calendar, Send, Loader, X } from 'lucide-react';
import { uploadProfileToIPFS } from '../services/ipfs';
import toast from 'react-hot-toast';

const issueCredentialSchema = z.object({
  subject: z.string().startsWith('0x').length(42, "Must be a valid Ethereum address."),
  credentialName: z.string().min(3, "Credential name is required."),
  credentialDescription: z.string().min(10, "Description is required."),
  expirationDate: z.date().optional(),
});

export default function IssueCredential({ contract, requestContract, issuerAddress, onCredentialIssued, onCancel, prefillData }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(issueCredentialSchema),
  });

  useEffect(() => {
    if (prefillData) {
      reset({
        subject: prefillData.subject,
        credentialName: prefillData.schemaName,
      });
    }
  }, [prefillData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('1/4: Uploading credential data to IPFS...');

    try {
      const credentialData = {
        '@context': [ 'https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1' ],
        type: ['VerifiableCredential', data.credentialName],
        issuer: issuerAddress,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: data.subject,
          degree: {
            name: data.credentialName,
            description: data.credentialDescription,
          }
        }
      };

      const ipfsHash = await uploadProfileToIPFS(credentialData);
      toast.loading('2/4: Issuing credential on-chain...', { id: toastId });

      const expirationTimestamp = data.expirationDate ? Math.floor(data.expirationDate.getTime() / 1000) : 0;
      const schemaId = '0x' + Buffer.from(data.credentialName).toString('hex').padEnd(64, '0');

      const tx = await contract.issueCredential(data.subject, schemaId, expirationTimestamp, ipfsHash);
      toast.loading('3/4: Waiting for issuance confirmation...', { id: toastId });
      await tx.wait();
      
      if (prefillData?.requestId && requestContract) {
        toast.loading('4/4: Finalizing request status...', { id: toastId });
        try {
          const approveTx = await requestContract.approveRequest(prefillData.requestId);
          await approveTx.wait();
        } catch (approveErr) {
          console.error("Failed to approve request after issuance:", approveErr);
          toast.error("Credential issued, but failed to update request status.");
        }
      }

      toast.success('Credential issued successfully!', { id: toastId });
      if (onCredentialIssued) onCredentialIssued();

    } catch (error) {
      console.error("Error issuing credential:", error);
      toast.error('Failed to issue credential.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
        <div className="info-card">
            <h3><Award size={20} /> Issue a New Credential</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Subject's Address</label>
                        <input type="text" {...register('subject')} placeholder="0x..." readOnly={!!prefillData} />
                    </div>
                    <div className="form-group">
                        <label>Credential Type</label>
                        <input type="text" {...register('credentialName')} placeholder="e.g., UniversityDegreeCredential" />
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea {...register('credentialDescription')} rows={4}></textarea>
                    </div>
                     <div className="form-group">
                        <label htmlFor="expirationDate"><Calendar size={16} /> Expiration Date (Optional)</label>
                        <input id="expirationDate" type="date" {...register('expirationDate', { valueAsDate: true })} />
                    </div>
                </div>
                <div className="credential-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}><X size={20} /><span>Cancel</span></button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <Loader size={20} className="spinner" /> : <Send size={20} />}
                        <span>Issue Credential</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}