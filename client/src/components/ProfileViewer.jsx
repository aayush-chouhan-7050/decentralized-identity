// src/components/ProfileViewer.jsx
import { useState } from 'react';
import { User, Mail, Globe, Briefcase, GraduationCap, Github, Linkedin, Twitter, Code, Building, Copy, Check, ExternalLink, FileText, Calendar, Users, Flag, Lock, Fingerprint } from 'lucide-react';

export default function ProfileViewer({ profile, onEdit, publicKey, walletAddress }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatHash = (hash) => hash ? `${hash.slice(0, 10)}...${hash.slice(-10)}` : '';

  // Helper for displaying a placeholder for empty fields
  const InfoPlaceholder = ({ text }) => (
    <p style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '0.9rem' }}>{text}</p>
  );

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.profilePhoto ? <img src={profile.profilePhoto} alt={profile.fullName} /> : <User size={80} />}
        </div>
        <div className="profile-info">
          <h1>{profile.fullName || 'Name not provided'}</h1>
          {profile.username && <p className="username">@{profile.username}</p>}
        </div>
        <button onClick={onEdit} className="btn-secondary"><User size={20} /><span>Edit Profile</span></button>
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <h3><User size={20} /> Personal Information</h3>
          {profile.fullName && <div className="info-item"><User size={16} /> {profile.fullName}</div>}
          {profile.dateOfBirth && <div className="info-item"><Calendar size={16} /> {profile.dateOfBirth}</div>}
          {profile.gender && <div className="info-item"><Users size={16} /> {profile.gender}</div>}
          {profile.nationality && <div className="info-item"><Flag size={16} /> {profile.nationality}</div>}
        </div>

        <div className="info-card">
          <h3><Mail size={20} /> Contact Information</h3>
          {profile.email && <div className="info-item"><Mail size={16} /> {profile.email}</div>}
          {profile.phoneNumber && <div className="info-item"><Globe size={16} /> {profile.phoneNumber}</div>}
          {profile.residentialAddress && <div className="info-item"><Building size={16} /> {profile.residentialAddress}</div>}
          {walletAddress && <div className="info-item"><Fingerprint size={16} /> {formatHash(walletAddress)}</div>}
        </div>

        <div className="info-card">
          <h3><FileText size={20} /> Government & Identity Documents</h3>
          {profile.nationalIdType && <div className="info-item"><FileText size={16} /> {profile.nationalIdType}</div>}
          {profile.documentFile && <div className="info-item"><Check size={16} /> Verified</div>}
          {!profile.documentFile && <div className="info-item"><User size={16} /> Not Verified</div>}
          {profile.documentFile && <div className="info-item"><FileText size={16} /> <a href={profile.documentFile} target="_blank" rel="noopener noreferrer">View Document</a></div>}
        </div>

        <div className="info-card">
            <h3><Lock size={20} /> Security Fields</h3>
            {publicKey && <div className="info-item"><Fingerprint size={16} /> <strong>Public Key:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{publicKey}</span></div>}
            <div className="info-item"><Fingerprint size={16} /> <strong>Digital Signature:</strong> A signature is generated to verify claims, not stored.</div>
        </div>

        <div className="info-card">
          <h3><Globe size={20} /> Blockchain Metadata</h3>
          {profile.did && <div className="info-item"><strong>DID:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{profile.did}</span></div>}
          {profile.ipfsCid && <div className="info-item"><strong>IPFS CID:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{formatHash(profile.ipfsCid)}</span></div>}
          {profile.transactionHash && <div className="info-item"><strong>Tx Hash:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{formatHash(profile.transactionHash)}</span></div>}
          {profile.createdAt && <div className="info-item"><strong>Timestamp:</strong> {new Date(profile.createdAt).toLocaleString()}</div>}
        </div>
      </div>
    </div>
  );
}