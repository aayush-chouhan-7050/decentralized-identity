// src/components/WelcomeScreen.jsx
import { Wallet, Sparkles, Database, Lock, Eye, ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ onConnect }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon"><Sparkles size={80} /></div>
      <h1>Welcome to DecentraID</h1>
      <p>Create and manage your self-sovereign digital identity on the blockchain.</p>
      <div className="features-grid">
        <div className="feature-card"><Database size={32} /><h3>Decentralized</h3><p>Your data is stored on IPFS, making it immutable and censorship-resistant.</p></div>
        <div className="feature-card"><Lock size={32} /><h3>Secure</h3><p>Cryptographic wallet authentication ensures only you can control your identity.</p></div>
        <div className="feature-card"><Eye size={32} /><h3>Transparent</h3><p>All operations are verifiable on-chain with complete transparency.</p></div>
      </div>
      <button onClick={onConnect} className="btn-primary btn-large">
        <Wallet size={24} /><span>Get Started</span><ArrowRight size={20} />
      </button>
    </div>
  );
}