// src/components/ProfileViewer.jsx
import { useState } from 'react';
import { User, Mail, Globe, Briefcase, GraduationCap, Github, Linkedin, Twitter, Code, Building, Copy, Check, ExternalLink } from 'lucide-react';

export default function ProfileViewer({ profile, onEdit }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDID = (did) => did ? `${did.slice(0, 15)}...${did.slice(-8)}` : '';

  // Helper for displaying a placeholder for empty fields
  const InfoPlaceholder = ({ text }) => (
    <p style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '0.9rem' }}>{text}</p>
  );

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.profileImage ? <img src={profile.profileImage} alt={profile.name} /> : <User size={80} />}
        </div>
        <div className="profile-info">
          <h1>{profile.name || 'Name not provided'}</h1>
          {profile.username && <p className="username">@{profile.username}</p>}
          {profile.occupation && <p className="occupation">{profile.occupation}</p>}
          <div className="did-display">
            <code style={{ wordBreak: 'break-all' }}>{formatDID(profile.did)}</code>
            <button onClick={() => copyToClipboard(profile.did)} className="copy-btn">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        <button onClick={onEdit} className="btn-secondary"><User size={20} /><span>Edit Profile</span></button>
      </div>

      {/* --- About Section --- */}
      <div className="profile-section">
        <h3>About</h3>
        {profile.bio ? <p>{profile.bio}</p> : <InfoPlaceholder text="No bio provided." />}
      </div>

      <div className="profile-grid">
        {/* --- Contact Information Card --- */}
        <div className="info-card">
          <h3><User size={20} /> Contact</h3>
          {profile.email 
            ? <div className="info-item"><Mail size={16} /> {profile.email}</div>
            : <div className="info-item"><Mail size={16} /> <InfoPlaceholder text="No email provided." /></div>
          }
        </div>

        {/* --- Professional Card --- */}
        <div className="info-card">
          <h3><Briefcase size={20} /> Professional</h3>
          {profile.occupation 
            ? <div className="info-item"><Briefcase size={16} /> {profile.occupation}</div>
            : <div className="info-item"><Briefcase size={16} /> <InfoPlaceholder text="No occupation listed." /></div>
          }
          {profile.organization 
            ? <div className="info-item"><Building size={16} /> {profile.organization}</div>
            : <div className="info-item"><Building size={16} /> <InfoPlaceholder text="No organization listed." /></div>
          }
           {profile.website 
            ? <div className="info-item"><Globe size={16} /> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></div>
            : <div className="info-item"><Globe size={16} /> <InfoPlaceholder text="No website listed." /></div>
          }
        </div>

        {/* --- Education Card --- */}
        <div className="info-card">
          <h3><GraduationCap size={20} /> Education</h3>
          {profile.education?.[0]?.institution ? (
            <>
              <strong>{profile.education[0].degree || 'Degree not specified'}</strong>
              <p>{profile.education[0].field || 'Field not specified'}</p>
              <p>{profile.education[0].institution} ({profile.education[0].year || 'Year not specified'})</p>
            </>
          ) : (
            <InfoPlaceholder text="No education listed." />
          )}
        </div>

        {/* --- Skills Card --- */}
        <div className="info-card">
          <h3><Code size={20} /> Skills</h3>
          {profile.skills?.length > 0 ? (
            <div className="tags">
              {profile.skills.map((skill, i) => <span key={i} className="tag">{skill}</span>)}
            </div>
          ) : (
            <InfoPlaceholder text="No skills added." />
          )}
        </div>

        {/* --- Social Links Card --- */}
        <div className="info-card social-links">
          <h3><Globe size={20} /> Social Links</h3>
          <div className="social-grid">
            {profile.socialLinks?.github 
              ? <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github size={20} /> GitHub</a>
              : <span><Github size={20} /> <InfoPlaceholder text="Not linked" /></span>
            }
            {profile.socialLinks?.linkedin 
              ? <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /> LinkedIn</a>
              : <span><Linkedin size={20} /> <InfoPlaceholder text="Not linked" /></span>
            }
             {profile.socialLinks?.twitter 
              ? <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={20} /> Twitter</a>
              : <span><Twitter size={20} /> <InfoPlaceholder text="Not linked" /></span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}