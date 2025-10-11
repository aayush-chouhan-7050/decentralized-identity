// src/components/HowToUse.jsx
import { Wallet, MousePointer, Edit, Save, ArrowLeft } from 'lucide-react';

export default function HowToUse({ onBack }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon"><Wallet size={80} /></div>
      <h1>How to Use DecentraID</h1>
      <p>Follow these simple steps to create and manage your decentralized identity. For the best experience, we recommend using the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> wallet.</p>

      <div className="features-grid" style={{ textAlign: 'left', gap: '1.5rem' }}>
        <div className="feature-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <MousePointer size={32} />
            <h3>Step 1: Connect Your Wallet</h3>
          </div>
          <p>Click the "Connect Wallet" button on the homepage. This will open a prompt to connect your Ethereum wallet (like MetaMask). Approve the connection to proceed.</p>
        </div>
        <div className="feature-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Edit size={32} />
            <h3>Step 2: Create Your Identity</h3>
          </div>
          <p>Once connected, you'll be prompted to create your identity. Fill out the form with your personal, professional, and social information. Your data is secure and private.</p>
        </div>
        <div className="feature-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Save size={32} />
            <h3>Step 3: Save and Sign</h3>
          </div>
          <p>After filling out the form, click "Create & Save Identity". You'll be asked to sign a transaction in your wallet. This transaction saves a secure pointer to your encrypted data on the blockchain, not the data itself.</p>
        </div>
      </div>
      <button onClick={onBack} className="btn-secondary" style={{ marginTop: '2rem' }}>
        <ArrowLeft size={20} /><span>Back to Home</span>
      </button>
    </div>
  );
}