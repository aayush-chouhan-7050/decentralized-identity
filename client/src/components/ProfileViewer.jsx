// src/components/ProfileViewer.jsx
import { User, Mail, Globe, Briefcase, GraduationCap, Github, Linkedin, Twitter, Code, Building, ExternalLink, FileText, Calendar, Users, Flag, Lock, Fingerprint, Edit } from 'lucide-react';

// NEW: Helper to extract CID from a full IPFS gateway URL
const extractCidFromUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const parts = url.split('/');
  return parts.pop() || '';
};

// NEW: A component to display info items cleanly, with placeholders for empty values
const InfoItem = ({ icon: Icon, label, value, isLink = false, isHash = false, isDate = false, placeholder = "Not provided" }) => {
  let displayValue = value;

  if (!value) {
    return (
      <div className="info-item placeholder">
        {Icon && <Icon size={16} />}
        <span>{label}:</span>
        <em>{placeholder}</em>
      </div>
    );
  }

  if (isLink) {
    displayValue = <a href={value} target="_blank" rel="noopener noreferrer">{label} Profile</a>;
  } else if (isHash) {
    displayValue = <span className="monospace">{`${value.slice(0, 10)}...${value.slice(-10)}`}</span>;
  } else if (isDate) {
    displayValue = new Date(value).toLocaleDateString();
  }

  return (
    <div className="info-item">
      {Icon && <Icon size={16} />}
      <span>{label}:</span>
      <strong>{displayValue}</strong>
    </div>
  );
};

export default function ProfileViewer({ profile, onEdit, publicKey, walletAddress }) {
  const hasProfessionalInfo = profile.jobTitle || profile.organization || profile.workExperience || profile.skills || profile.resume || profile.portfolio;
  const hasEducationalInfo = profile.highestQualification || profile.institutionName || profile.graduationYear || profile.certifications;
  const hasSocialInfo = profile.linkedin || profile.github || profile.twitter || profile.blog;
  const hasDocumentInfo = profile.nationalIdType || profile.documentFile;

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
        <button onClick={onEdit} className="btn-secondary"><Edit size={18} /><span>Edit Profile</span></button>
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <h3><User size={20} /> Personal Information</h3>
          <InfoItem icon={User} label="Full Name" value={profile.fullName} />
          <InfoItem icon={Calendar} label="Date of Birth" value={profile.dateOfBirth} isDate />
          <InfoItem icon={Users} label="Gender" value={profile.gender} />
          <InfoItem icon={Flag} label="Nationality" value={profile.nationality} />
        </div>

        <div className="info-card">
          <h3><Mail size={20} /> Contact Information</h3>
          <InfoItem icon={Mail} label="Email" value={profile.email} />
          <InfoItem icon={Globe} label="Phone" value={profile.phoneNumber} />
          <InfoItem icon={Building} label="Address" value={profile.residentialAddress} />
          <InfoItem icon={Fingerprint} label="Wallet" value={walletAddress} isHash />
        </div>

        {hasProfessionalInfo && (
          <div className="info-card">
            <h3><Briefcase size={20} /> Professional</h3>
            <InfoItem icon={Briefcase} label="Job Title" value={profile.jobTitle} />
            <InfoItem icon={Building} label="Organization" value={profile.organization} />
            <InfoItem icon={Calendar} label="Experience" value={profile.workExperience ? `${profile.workExperience} years` : ''} />
            <InfoItem icon={Code} label="Skills" value={profile.skills} />
            <InfoItem icon={FileText} label="Résumé" value={profile.resume} isLink />
            <InfoItem icon={Code} label="Résumé CID" value={extractCidFromUrl(profile.resume)} isHash />
            <InfoItem icon={ExternalLink} label="Portfolio" value={profile.portfolio} isLink />
          </div>
        )}

        {hasEducationalInfo && (
          <div className="info-card">
            <h3><GraduationCap size={20} /> Education</h3>
            <InfoItem icon={GraduationCap} label="Qualification" value={profile.highestQualification} />
            <InfoItem icon={Building} label="Institution" value={profile.institutionName} />
            <InfoItem icon={Calendar} label="Graduation Year" value={profile.graduationYear} />
            <InfoItem icon={FileText} label="Certifications" value={profile.certifications} />
          </div>
        )}
        
        {hasSocialInfo && (
            <div className="info-card">
                <h3><Globe size={20} /> Online Presence</h3>
                <InfoItem icon={Linkedin} label="LinkedIn" value={profile.linkedin} isLink />
                <InfoItem icon={Github} label="GitHub" value={profile.github} isLink />
                <InfoItem icon={Twitter} label="Twitter / X" value={profile.twitter} isLink />
                <InfoItem icon={ExternalLink} label="Blog" value={profile.blog} isLink />
            </div>
        )}
        
        {hasDocumentInfo && (
          <div className="info-card">
            <h3><FileText size={20} /> Identity Documents</h3>
            <InfoItem icon={FileText} label="ID Type" value={profile.nationalIdType} />
            <InfoItem icon={FileText} label="Document" value={profile.documentFile} isLink />
            <InfoItem icon={Code} label="Document CID" value={extractCidFromUrl(profile.documentFile)} isHash />
            <div className="info-item">
              <Fingerprint size={16} />
              <span>Verification:</span>
              <strong>{profile.documentFile ? 'Document Uploaded' : 'Not Uploaded'}</strong>
            </div>
          </div>
        )}

        <div className="info-card">
          <h3><Lock size={20} /> Security & Blockchain</h3>
          <InfoItem icon={Fingerprint} label="Public Key" value={publicKey} isHash />
          <InfoItem icon={Code} label="DID" value={profile.did} isHash/>
          <InfoItem icon={Code} label="Profile CID" value={profile.ipfsCid} isHash />
          <InfoItem icon={Code} label="Photo CID" value={extractCidFromUrl(profile.profilePhoto)} isHash />
        </div>
      </div>
    </div>
  );
}