# Decentralized Digital Identity Management

A blockchain-based Self-Sovereign Identity (SSI) solution built on Ethereum that empowers users to create, manage, and own their digital identity without reliance on centralized intermediaries.

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Smart Contract Details](#-smart-contract-details)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Traditional digital identity systems are centralized, creating vulnerabilities around data privacy, security, and user control. This project addresses these challenges by implementing a decentralized identity management system where:

- **Users own their identity** - No central authority can revoke or modify your identity
- **Data sovereignty** - You control what information is shared and with whom
- **Censorship-resistant** - Built on blockchain technology for immutability
- **Transparent** - All operations are verifiable on the blockchain

### Problem Statement

Current digital identity systems suffer from:
- ❌ Lack of user control over personal data
- ❌ Data silos preventing identity portability
- ❌ Centralized databases as targets for large-scale breaches
- ❌ Privacy concerns with data monetization

### Our Solution

✅ Self-Sovereign Identity (SSI) on Ethereum blockchain  
✅ Cryptographic wallet-based authentication  
✅ User-controlled identity creation and management  
✅ Immutable, transparent identity registry  

## ✨ Features

- 🔐 **Wallet-Based Authentication** - Connect using MetaMask or WalletConnect
- 🆔 **Identity Creation** - Create your digital identity linked to your wallet address
- 📝 **Identity Management** - View and manage your on-chain identity
- 🔒 **Security** - Private keys never leave your wallet
- ⚡ **Fast & Efficient** - Built on Ethereum Sepolia testnet
- 🌐 **Decentralized** - No central authority or single point of failure
- 📊 **Transparent** - All operations verifiable on Etherscan

## 🛠 Technology Stack

### Blockchain & Smart Contracts
- **Ethereum (Sepolia Testnet)** - Layer 1 blockchain for deployment
- **Solidity ^0.8.28** - Smart contract programming language
- **Hardhat** - Development environment for testing and deployment

### Frontend
- **React.js 19.1** - Modern UI framework
- **Vite** - Next-generation frontend tooling
- **Ethers.js 6.15** - Ethereum library for blockchain interaction
- **Web3Modal 5.1** - Multi-wallet connection solution

### Development Tools
- **Node.js** - JavaScript runtime
- **Chai** - Testing assertion library
- **dotenv** - Environment variable management

## 🏗 System Architecture

```
┌─────────────────┐
│   User (You)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MetaMask     │ ◄── Private Key Management
│   (Wallet)      │     Transaction Signing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   React DApp    │ ◄── User Interface
│   (Frontend)    │     State Management
└────────┬────────┘
         │
         ▼ (Ethers.js)
┌─────────────────┐
│   Ethereum      │ ◄── Identity Storage
│   Blockchain    │     Smart Contract Logic
│  (Sepolia Net)  │     Immutable Ledger
└─────────────────┘
```

### Data Flow

1. **User Action** → User interacts with React DApp
2. **Transaction Creation** → Ethers.js formats blockchain transaction
3. **Signature Request** → MetaMask prompts user to sign
4. **Broadcast** → Signed transaction sent to Sepolia network
5. **Mining** → Validators process and include in block
6. **State Update** → Smart contract state updated on-chain
7. **UI Update** → DApp fetches and displays new state

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Additional Requirements

- Sepolia testnet ETH (for deployment) - [Get from faucet](https://sepoliafaucet.com/)
- WalletConnect Project ID - [Get from Cloud Dashboard](https://cloud.walletconnect.com/)

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aayush-chouhan-7050/decentralized-identity.git
cd decentralized-identity
```

### 2. Install Backend Dependencies

```bash
npm install
```

This installs Hardhat and all necessary development dependencies for smart contract development.

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

This installs React, Ethers.js, Web3Modal, and all frontend dependencies.

## ⚙️ Configuration

### 1. Environment Variables Setup

Create a `.env` file in the **root directory**:

```bash
# Root .env file (for Hardhat deployment)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_metamask_private_key_here
```

⚠️ **Security Warning**: Never commit your `.env` file. It's already in `.gitignore`.

### 2. Get Required Credentials

#### Alchemy RPC URL
1. Create account at [Alchemy](https://www.alchemy.com/)
2. Create new app on Sepolia network
3. Copy the HTTPS RPC URL

#### MetaMask Private Key
1. Open MetaMask
2. Click three dots → Account Details → Export Private Key
3. Enter password and copy key

⚠️ **Use a test wallet only! Never use your main wallet's private key.**

#### WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create new project
3. Copy Project ID

### 3. Frontend Environment Variables

Create `.env` file in the **client** directory:

```bash
# client/.env file
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
VITE_PROJECT_ID=your_walletconnect_project_id
```

## 🚀 Running the Project

### Step 1: Compile Smart Contracts

```bash
npx hardhat compile
```

This compiles the Solidity smart contract and generates artifacts.

### Step 2: Run Tests (Optional but Recommended)

```bash
npx hardhat test
```

Expected output:
```
Identity Contract
  Deployment
    ✔ Should deploy without errors
  Identity Creation
    ✔ Should allow a user to create a new identity
    ✔ Should emit an IdentityCreated event upon creation
    ✔ Should NOT allow a user to create an identity twice
    ✔ Should NOT allow creating an identity with an empty name

5 passing (2s)
```

### Step 3: Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Save the deployed contract address from the output:
```
Deploying Identity contract...
Identity contract deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

### Step 4: Update Frontend Configuration

Update `client/.env` with your deployed contract address:

```bash
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### Step 5: Start Frontend Development Server

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 6: Configure MetaMask

1. Open MetaMask
2. Add Sepolia test network (if not already added)
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Connect to your DApp

## 🧪 Testing

### Run All Tests

```bash
npx hardhat test
```

### Run Tests with Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

### Run Tests with Coverage

```bash
npx hardhat coverage
```

### Test Specific File

```bash
npx hardhat test test/Identity.test.js
```

## 📦 Deployment

### Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Deploy to Local Hardhat Network (for development)

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### Verify Contract on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 📖 Usage Guide

### For End Users

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select MetaMask or WalletConnect
   - Approve connection in your wallet

2. **Create Identity**
   - Enter your name and email
   - Click "Create" button
   - Approve transaction in MetaMask
   - Wait for confirmation (~15 seconds)

3. **View Identity**
   - Your identity will automatically display once created
   - Information is stored permanently on blockchain
   - Reconnecting will load your existing identity

### For Developers

#### Interact with Contract Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

```javascript
const Identity = await ethers.getContractFactory("Identity");
const contract = Identity.attach("YOUR_CONTRACT_ADDRESS");

// Get identity
const identity = await contract.identities("WALLET_ADDRESS");
console.log(identity);
```

#### Frontend Integration Example

```javascript
import { BrowserProvider, Contract } from 'ethers';

// Connect to contract
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new Contract(contractAddress, contractABI, signer);

// Create identity
const tx = await contract.createIdentity("John Doe", "john@example.com");
await tx.wait();

// Read identity
const identity = await contract.identities(address);
console.log(identity.name, identity.email);
```

## 📁 Project Structure

```
decentralized-identity/
├── contracts/
│   └── Identity.sol              # Main smart contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── test/
│   └── Identity.test.js          # Contract tests
├── client/                       # React frontend
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── config.js            # Contract configuration
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Styles
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Frontend dependencies
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Backend dependencies
├── .gitignore                   # Git ignore rules
├── .env                         # Environment variables (root)
└── README.md                    # This file
```

## 🔐 Smart Contract Details

### Identity.sol

```solidity
contract Identity {
    struct UserIdentity {
        string name;
        string email;
        bool isCreated;
    }
    
    mapping(address => UserIdentity) public identities;
    
    event IdentityCreated(address indexed user, string name, uint256 timestamp);
    
    function createIdentity(string memory _name, string memory _email) public {
        require(!identities[msg.sender].isCreated, "Identity already exists");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        identities[msg.sender] = UserIdentity(_name, _email, true);
        emit IdentityCreated(msg.sender, _name, block.timestamp);
    }
}
```

### Key Functions

- **`createIdentity(string name, string email)`** - Creates new identity for caller
- **`identities(address)`** - Public mapping to view any address's identity

### Events

- **`IdentityCreated(address user, string name, uint256 timestamp)`** - Emitted on creation

### Security Features

- ✅ One identity per address enforcement
- ✅ Non-empty name validation
- ✅ No centralized owner/admin
- ✅ Immutable once deployed
- ✅ Public verifiability

## 🔒 Security Considerations

### Smart Contract Security

- **Reentrancy Protection**: Not needed (no external calls)
- **Access Control**: User-specific operations only
- **Input Validation**: Name length checks implemented
- **State Management**: Simple mapping structure minimizes risks

### Best Practices Implemented

✅ Use of `require()` statements for validation  
✅ Events for transparency and logging  
✅ Minimal external dependencies  
✅ No use of `selfdestruct` or `delegatecall`  
✅ Simple, auditable code structure  

### Privacy Considerations

⚠️ **Important**: All data on blockchain is public!

- Names and emails are publicly visible
- For production, use:
  - Hash-based commitments
  - Off-chain storage (IPFS) with on-chain hashes
  - Zero-knowledge proofs for verification

### User Security Guidelines

1. **Never share your private key**
2. **Use test wallets for development**
3. **Verify contract addresses before interacting**
4. **Keep seed phrases secure offline**
5. **Enable MetaMask security features**

## 🚀 Future Enhancements

### Planned Features

1. **Verifiable Credentials (W3C Standard)**
   - Issue and verify digital credentials
   - Attestations from trusted entities
   - Revocation registry

2. **IPFS Integration**
   - Store large data off-chain
   - Only hash stored on blockchain
   - Enhanced privacy and lower costs

3. **Social Recovery**
   - Guardian-based account recovery
   - Multi-signature approval process
   - Protection against key loss

4. **ENS Integration**
   - Link human-readable .eth names
   - Improved user experience
   - Identity resolution

5. **Update Functionality**
   - Modify existing identity information
   - Version control for changes
   - Audit trail

6. **DAO Governance**
   - Community-driven protocol upgrades
   - Voting mechanisms
   - Decentralized decision making

7. **Multi-Chain Support**
   - Deploy on Polygon, Arbitrum, Optimism
   - Cross-chain identity portability
   - Lower transaction costs

8. **Advanced Features**
   - Reputation scoring
   - Selective disclosure
   - Zero-knowledge proofs
   - DID standards compliance

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow Solidity style guide
- Comment your code
- Update documentation
- Test on Sepolia before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aayush Chouhan**

- Major Project: Decentralized Digital Identity Management
- Date: October 7, 2025

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Check existing documentation
- Review Hardhat documentation: [hardhat.org](https://hardhat.org/)
- Review Ethers.js docs: [docs.ethers.org](https://docs.ethers.org/)

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- OpenZeppelin for security best practices
- Hardhat team for excellent development tools
- Web3Modal for wallet connection solutions
- The open-source community

## 📚 Resources

- [Ethereum Documentation](https://ethereum.org/developers)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [React Documentation](https://react.dev/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

---

**⭐ If you find this project useful, please consider giving it a star!**

Built with ❤️ using Blockchain Technology
