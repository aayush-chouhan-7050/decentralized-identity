// src/components/Header.jsx
import { useState, useRef } from 'react'; // NEW: Import useRef
import { useOnClickOutside } from '../hooks/useOnClickOutside'; // NEW: Import the custom hook
import { Wallet, Shield, LogOut, Copy, Check, ChevronDown } from 'lucide-react';

export default function Header({ isConnected, address, onConnect, onDisconnect }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // NEW: Create a ref for the menu container
  const menuRef = useRef(null);

  // NEW: Use the hook to close the menu when clicking outside
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
          // NEW: Attach the ref to the parent div of the menu
          <div className="wallet-info" ref={menuRef}>
            <div className="network-badge"><div className="status-dot"></div>Sepolia</div>
            <div className="address-display" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {formatAddress(address)}
              <ChevronDown size={16} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </div>
            {isMenuOpen && (
              <div className="wallet-menu">
                <button className="wallet-menu-item" onClick={() => { copyToClipboard(address); setIsMenuOpen(false); }}>
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