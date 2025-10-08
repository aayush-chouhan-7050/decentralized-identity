import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { contractAddress, contractABI, sepoliaRpc, projectId } from './config';

// --- Web3Modal & Constants --- (No changes here)
const sepolia = { chainId: 11155111, name: 'Sepolia', currency: 'SEP', explorerUrl: 'https://sepolia.etherscan.io', rpcUrl: sepoliaRpc };
const metadata = { name: 'Decentralized Identity', description: 'A dApp for managing a decentralized identity.', url: 'https://your-dapp-url.com/', icons: ['https://avatars.githubusercontent.com/u/37784886'] };
createWeb3Modal({ ethersConfig: { metadata, defaultChainId: 11155111, rpcUrl: 'https://cloudflare-eth.com' }, chains: [sepolia], projectId, enableAnalytics: true });
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

// --- Updated Initial State with All Fields ---
const initialProfileState = {
  name: "", username: "", email: "", bio: "", profileImage: "",
  dateOfBirth: "", gender: "", nationality: "",
  occupation: "", organization: "",
  education: [{ institution: "", degree: "", year: "" }], // Supports one entry for simplicity
  skills: [], languages: [],
  address: { country: "", state: "", city: "", postalCode: "" },
  socialLinks: { github: "", linkedin: "" }
};

function App() {
  // --- Hooks and State ---
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [contract, setContract] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileInput, setProfileInput] = useState(initialProfileState);

  // --- Effects ---
  useEffect(() => {
    if (isConnected && walletProvider) {
      const provider = new BrowserProvider(walletProvider);
      provider.getSigner().then(signer => setContract(new Contract(contractAddress, contractABI, signer)));
    } else {
      setContract(null);
      setProfile(null);
    }
  }, [isConnected, walletProvider]);

  useEffect(() => {
    const getProfile = async () => {
      if (contract && address) {
        setLoading(true);
        try {
          const id = await contract.identities(address);
          if (id.isCreated) {
            const response = await axios.get(IPFS_GATEWAY + id.ipfsHash);
            // Deep merge to ensure nested objects and arrays are handled correctly
            const fetchedProfile = {
              ...initialProfileState,
              ...response.data,
              address: { ...initialProfileState.address, ...response.data.address },
              socialLinks: { ...initialProfileState.socialLinks, ...response.data.socialLinks },
              education: response.data.education && response.data.education.length > 0 ? response.data.education : initialProfileState.education
            };
            setProfile(fetchedProfile);
            setProfileInput(fetchedProfile);
          } else {
            setProfile(null);
            setProfileInput(initialProfileState);
          }
        } catch (err) { console.error("Could not fetch profile:", err); }
        setLoading(false);
      }
    };
    getProfile();
  }, [contract, address]);

  // --- Data Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setProfileInput(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } }));
    } else {
      setProfileInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, fieldName) => {
    const array = e.target.value.split(',').map(item => item.trim());
    setProfileInput(prev => ({ ...prev, [fieldName]: array }));
  };
  
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setProfileInput(prev => ({
      ...prev,
      education: [{ ...prev.education[0], [name]: value }]
    }));
  };

  const uploadToIpfs = async (dataToUpload) => {
    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", dataToUpload, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_KEY
        }
      });
      return response.data.IpfsHash;
    } catch (error) { throw new Error("Error uploading to IPFS"); }
  };

  const handleSubmitProfile = async () => {
    if (!profileInput.name || !contract) return;
    setLoading(true);
    try {
      const fullProfileData = {
        ...profileInput,
        did: `did:ethr:${address}`,
        controller: address,
        updatedAt: new Date().toISOString()
      };
      
      const ipfsHash = await uploadToIpfs(fullProfileData);
      const tx = profile ? await contract.updateIdentity(ipfsHash) : await contract.createIdentity(ipfsHash);
      await tx.wait();
      
      const id = await contract.identities(address);
      const response = await axios.get(IPFS_GATEWAY + id.ipfsHash);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Failed to submit profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Rendering ---
  const renderProfileForm = () => (
    <div className="form-container">
      <h2>{profile ? 'Update Your Profile' : 'Create Your Profile'}</h2>
      <div className="tab-nav">
        <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>Basic Info</button>
        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Personal Details</button>
        <button className={activeTab === 'professional' ? 'active' : ''} onClick={() => setActiveTab('professional')}>Professional</button>
        <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>Social Links</button>
      </div>

      <div className="tab-content">
        {activeTab === 'basic' && <div className="form-section">
          <input name="name" placeholder="Full Name *" value={profileInput.name} onChange={handleInputChange} />
          <input name="username" placeholder="Username (e.g., aayush.eth)" value={profileInput.username} onChange={handleInputChange} />
          <input name="email" type="email" placeholder="Email Address" value={profileInput.email} onChange={handleInputChange} />
          <input name="profileImage" placeholder="Profile Image URL (e.g., ipfs://...)" value={profileInput.profileImage} onChange={handleInputChange} />
          <textarea name="bio" placeholder="Bio" value={profileInput.bio} onChange={handleInputChange} />
        </div>}
        
        {activeTab === 'details' && <div className="form-section">
          <h3>Personal Details</h3>
          <input name="dateOfBirth" type="date" placeholder="Date of Birth" value={profileInput.dateOfBirth} onChange={handleInputChange} />
          <input name="gender" placeholder="Gender" value={profileInput.gender} onChange={handleInputChange} />
          <input name="nationality" placeholder="Nationality" value={profileInput.nationality} onChange={handleInputChange} />
          <h3>Address</h3>
          <input name="address.city" placeholder="City" value={profileInput.address.city} onChange={handleInputChange} />
          <input name="address.state" placeholder="State / Province" value={profileInput.address.state} onChange={handleInputChange} />
          <input name="address.country" placeholder="Country" value={profileInput.address.country} onChange={handleInputChange} />
          <input name="address.postalCode" placeholder="Postal Code" value={profileInput.address.postalCode} onChange={handleInputChange} />
        </div>}

        {activeTab === 'professional' && <div className="form-section">
          <h3>Work</h3>
          <input name="occupation" placeholder="Occupation" value={profileInput.occupation} onChange={handleInputChange} />
          <input name="organization" placeholder="Organization" value={profileInput.organization} onChange={handleInputChange} />
          <h3>Skills & Languages</h3>
          <input name="skills" placeholder="Skills (comma-separated)" value={profileInput.skills.join(', ')} onChange={(e) => handleArrayChange(e, 'skills')} />
          <input name="languages" placeholder="Languages (comma-separated)" value={profileInput.languages.join(', ')} onChange={(e) => handleArrayChange(e, 'languages')} />
          <h3>Education</h3>
          <input name="institution" placeholder="Institution" value={profileInput.education[0].institution} onChange={handleEducationChange} />
          <input name="degree" placeholder="Degree" value={profileInput.education[0].degree} onChange={handleEducationChange} />
          <input name="year" type="number" placeholder="Year of Completion" value={profileInput.education[0].year} onChange={handleEducationChange} />
        </div>}

        {activeTab === 'social' && <div className="form-section">
          <h3>Social & Professional Links</h3>
          <input name="socialLinks.github" placeholder="GitHub URL" value={profileInput.socialLinks.github} onChange={handleInputChange} />
          <input name="socialLinks.linkedin" placeholder="LinkedIn URL" value={profileInput.socialLinks.linkedin} onChange={handleInputChange} />
        </div>}
      </div>

      <div className="form-actions">
        <button onClick={handleSubmitProfile}>{profile ? 'Save Changes' : 'Create Identity'}</button>
        {isEditing && <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="profile-view">
      <div className="profile-header">
        <img src={profile.profileImage || 'https://placehold.co/100x100'} alt="Profile" className="profile-avatar"/>
        <div>
          <h2>{profile.name}</h2>
          <p>@{profile.username}</p>
          <p className="address-display">{profile.did}</p>
        </div>
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>
      <div className="profile-body">
        <div className="profile-section"><h3>About</h3><p>{profile.bio}</p></div>
        <div className="profile-section"><h3>Details</h3><p><strong>Email:</strong> {profile.email}</p><p><strong>Born:</strong> {profile.dateOfBirth}</p><p><strong>Nationality:</strong> {profile.nationality}</p><p><strong>Address:</strong> {`${profile.address.city}, ${profile.address.state}, ${profile.address.country}`}</p></div>
        <div className="profile-section"><h3>Professional</h3><p><strong>Occupation:</strong> {profile.occupation} at {profile.organization}</p><p><strong>Skills:</strong> {profile.skills.join(', ')}</p><p><strong>Languages:</strong> {profile.languages.join(', ')}</p></div>
        <div className="profile-section"><h3>Education</h3><p>{`${profile.education[0].degree} from ${profile.education[0].institution} (${profile.education[0].year})`}</p></div>
        <div className="profile-section"><h3>Links</h3><a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!isConnected) return <div className="card"><button onClick={() => open()}>Connect Wallet</button></div>;
    if (loading) return <div className="card"><p>Loading... Please wait for the transaction to complete.</p></div>;
    if (isEditing || !profile) return renderProfileForm();
    if (profile) return renderProfileView();
  };

  return (
    <div className="container">
      <h1>Decentralized Identity Profile</h1>
      {isConnected && <p className="address-display">Connected: {address}</p>}
      <hr />
      {renderContent()}
    </div>
  );
}

export default App;