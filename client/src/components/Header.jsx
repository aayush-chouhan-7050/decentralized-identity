// src/components/Header.jsx
import { useState, useRef } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside'; // IMPORT THE HOOK
import { Wallet, Shield, LogOut, Copy, Check, ChevronDown } from 'lucide-react';

export default function Header({ isConnected, address, onConnect, onDisconnect }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Use the hook to close the menu
  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  const formatAddress = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon"><Shield size={32} /></div>
          <div className="logo-text"><h1>DecentraID</h1><p>Self-Sovereign Identity</p></div>
        </div>
        
        {!isConnected ? (
          <button onClick={onConnect} className="btn-connect"><Wallet size={20} /><span>Connect Wallet</span></button>
        ) : (
          <div className="wallet-info" ref={menuRef}>
            <div className="network-badge"><div className="status-dot"></div>Sepolia</div>
            <button className="address-display" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-haspopup="true" aria-controls="wallet-menu">
              {formatAddress(address)}
              <ChevronDown size={22} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>
            {isMenuOpen && (
              <div className="wallet-menu">
                <button className="wallet-menu-item" onClick={() => { copyToClipboard(address); }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>
                <button className="wallet-menu-item disconnect" onClick={() => { onDisconnect(); setIsMenuOpen(false); }}>
                  <LogOut size={16} />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}