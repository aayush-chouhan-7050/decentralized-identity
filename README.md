# DecentraID - Decentralized Digital Identity Management

A blockchain-based Self-Sovereign Identity (SSI) solution built on Ethereum that empowers users to create, manage, and own their digital identity without reliance on centralized intermediaries. DecentraID combines the immutability of blockchain with the privacy and scalability of IPFS to create a truly decentralized identity management system, now featuring **W3C Verifiable Credentials** for tamper-proof digital attestations.

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)
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
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Smart Contract Details](#-smart-contract-details)
- [IPFS Integration](#-ipfs-integration)
- [Verifiable Credentials](#-verifiable-credentials)
- [Security & Privacy](#-security--privacy-considerations)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

## 🌟 Overview

Traditional digital identity systems are centralized, creating vulnerabilities around data privacy, security, and user control. This project addresses these challenges by implementing a decentralized identity management system where:

- **Users own their identity** - No central authority can revoke or modify your identity
- **Data sovereignty** - You control what information is shared and with whom
- **Censorship-resistant** - Built on blockchain technology for immutability
- **Transparent** - All operations are verifiable on the blockchain
- **Verifiable Credentials** - Trusted issuers can attest to your qualifications and achievements

### Problem Statement

Current digital identity systems suffer from:
- ❌ Lack of user control over personal data
- ❌ Data silos preventing identity portability
- ❌ Centralized databases as targets for large-scale breaches
- ❌ Privacy concerns with data monetization
- ❌ Difficulty verifying credentials without contacting issuers

### Our Solution

✅ Self-Sovereign Identity (SSI) using Ethereum and IPFS  
✅ Cryptographic wallet-based authentication  
✅ User-controlled creation and updates of a rich, off-chain profile  
✅ An immutable on-chain registry that stores only content-addressed hashes (IPFS CID)  
✅ W3C-compliant Verifiable Credentials for trusted attestations  
✅ Decentralized credential issuance, verification, and revocation  

## ✨ Features

### Core Identity Management
- 🔐 **Multi-Wallet Support** - Connect using MetaMask or any WalletConnect-compatible wallet
- 🖼️ **Rich Profile Management** - Create comprehensive profiles with personal, professional, educational, and social information
- 🔄 **Identity Updates** - Seamlessly update your profile by uploading new data to IPFS
- 💾 **Decentralized Storage** - All profile data stored on IPFS for privacy and cost-efficiency
- 📁 **File Uploads** - Support for profile photos, resumes, and identity documents
- 🔗 **On-Chain Verification** - Smart contract stores only IPFS hashes as immutable pointers
- 🌐 **Fully Decentralized** - No central authority with all operations verifiable on blockchain

### Verifiable Credentials (W3C Standard)
- 🪪 **Issue Credentials** - Authorized issuers can create and issue verifiable credentials (degrees, certificates, licenses)
- 📜 **W3C Compliance** - Credentials follow W3C Verifiable Credentials Data Model
- ✅ **Credential Verification** - On-chain registry for instant verification without contacting issuer
- 🔄 **Request System** - Users can request credentials from registered issuers
- 📋 **Issuer Dashboard** - Dedicated interface for issuers to manage credential requests
- 🚫 **Revocation Support** - Both issuers and subjects can revoke credentials
- ⏰ **Expiration Tracking** - Automatic detection of expired credentials
- 🎯 **Status Display** - Real-time credential status (Active, Revoked, Expired)

### User Experience
- 🎨 **Modern UI/UX** - Beautiful, responsive interface with dark mode
- 📱 **Mobile Responsive** - Works seamlessly across all devices
- ⚡ **Form Validation** - Real-time validation with Zod schema
- 💫 **Step-by-Step Wizard** - Intuitive 6-step profile creation process
- 📝 **Auto-Save Drafts** - Automatically saves form progress for new profiles
- 📊 **Comprehensive Profile View** - Display all identity information with CID verification

## 🛠 Technology Stack

### Blockchain & Smart Contracts
- **Ethereum (Sepolia Testnet)** - Layer 1 blockchain for deployment
- **Solidity ^0.8.28** - Smart contract programming language
- **Hardhat 2.26** - Development environment for testing and deployment

### Off-Chain Storage
- **IPFS (InterPlanetary File System)** - A peer-to-peer network for storing and sharing data
- **Pinata** - IPFS pinning service ensuring data availability

### Frontend
- **React.js 19.1** - Modern UI framework with hooks
- **Vite 7.1** - Next-generation frontend build tool
- **Ethers.js 6.15** - Ethereum library for blockchain interaction
- **Web3Modal 5.1** - Multi-wallet connection solution
- **React Hook Form 7.64** - Performant form handling
- **Zod 4.1** - TypeScript-first schema validation
- **Axios 1.12** - HTTP client for API requests
- **Lucide React 0.545** - Beautiful & consistent icons
- **React Hot Toast 2.6** - Elegant toast notifications

## 🏗 System Architecture

The updated architecture separates on-chain logic from off-chain data, providing a scalable and private solution with support for verifiable credentials.

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                     │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Profile    │  │  Credential  │  │    Issuer    │             │
│  │   Editor     │  │   Request    │  │  Dashboard   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Profile    │  │    Issue     │  │   How To     │             │
│  │   Viewer     │  │  Credential  │  │     Use      │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                        BLOCKCHAIN LAYER                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Identity   │  │  Credential  │  │  Credential  │             │
│  │   Contract   │  │   Registry   │  │   Request    │             │
│  │              │  │   Contract   │  │   Contract   │             │
│  │ - Create     │  │ - Add Issuer │  │ - Create Req │             │
│  │ - Update     │  │ - Issue Cred │  │ - Approve    │             │
│  │ - Store CID  │  │ - Revoke     │  │ - Reject     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                   │
│              Ethereum Blockchain (Sepolia Testnet)                │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER (IPFS)                          │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Profile    │  │  Credential  │  │    Files     │              │
│  │     JSON     │  │     JSON     │  │  (Photos,    │              │
│  │              │  │  (W3C Comp)  │  │  Documents)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                    │
│                    IPFS via Pinata Service                         │
└────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Diagram

```
┌─────────────┐
│    User     │
│  (Wallet)   │
└──────┬──────┘
       │
       │ 1. Connect Wallet
       ▼
┌───────────────────────────────────────────────────────────────┐
│                         React DApp                            │
│                                                               │
│  ┌────────────────┐    ┌────────────────┐    ┌──────────────┐ │
│  │   Web3Modal    │───▶│   Ethers.js    │───▶│   MetaMask   │ │
│  │  (Connection)  │    │  (Blockchain)  │    │  (Signing)   │ │
│  └────────────────┘    └────────────────┘    └──────────────┘ │
│                                                               │
│  ┌────────────────┐    ┌────────────────┐                     │
│  │  IPFS Service  │───▶│  Pinata API    │                     │
│  │ (Upload/Fetch) │    │  (Pin Files)   │                     │
│  └────────────────┘    └────────────────┘                     │
└───────────────────────────────────────────────────────────────┘
       │                         │                       │
       │                         │                       │
       ▼                         ▼                       ▼
┌─────────────┐         ┌─────────────┐        ┌─────────────┐
│  Identity   │         │ Credential  │        │ Credential  │
│  Contract   │         │  Registry   │        │   Request   │
└─────────────┘         └─────────────┘        └─────────────┘
       │                         │                       │
       │                         ▼                       │
       │                  ┌─────────────┐                │
       │                  │   Issuer    │                │
       │                  │  Approval   │                │
       │                  └─────────────┘                │
       │                         │                       │
       └─────────────────────────┴───────────────────────┘
                                 │
                                 ▼
                         ┌─────────────┐
                         │    IPFS     │
                         │  (Storage)  │
                         └─────────────┘
```

### Data Flow Diagrams

#### 1. Identity Creation Flow

```
┌──────┐                                                  ┌──────────┐
│ User │                                                  │ MetaMask │
└───┬──┘                                                  └────┬─────┘
    │                                                          │
    │ 1. Fill Profile Form                                     │
    │ ──────────────────────────────────────-──┐               │
    │                                          │               │
    │ 2. Upload Files (Photo, Resume, Docs)    │               │
    ├───────────────────────────────────────-──┼───────────────┤
    │                                          │               │
    │              ┌──────────────────────┐    │               │
    │              │   Pinata/IPFS        │◀───┘               │
    │              │   Returns File URLs  │                    │
    │              └──────────────────────┘                    │
    │                        │                                 │
    │ 3. Compile Complete JSON with File URLs                  │
    │ ─────────────────────────────────────-───┐               │
    │                                          │               │
    │ 4. Upload JSON to IPFS                   │               │
    ├──────────────────────────────────────────┼───────────────┤
    │                                          │               │
    │              ┌──────────────────────┐    │               │
    │              │   Pinata/IPFS        │◀───┘               │
    │              │   Returns CID        │                    │
    │              └──────────────────────┘                    │
    │                        │                                 │
    │ 5. Call createIdentity(CID)                              │
    ├──────────────────────────────────────────────────────────▶
    │                                                          │
    │ 6. Sign Transaction                                      │
    │ ◀─────────────────────────────────────────────────────────
    │                                                          │
    │ 7. Broadcast to Blockchain                               │
    ├──────────────────────────────────────────┐               │
    │                                          │               │
    │           ┌─────────────────────┐        │               │
    │           │  Identity Contract  │◀───────┘               │
    │           │  Stores CID         │                        │
    │           └─────────────────────┘                        │
    │                        │                                 │
    │ 8. Transaction Confirmed                                 │
    │ ◀──────────────────────┘                                 │
    │                                                          │
    │ 9. Profile Cached Locally                                │
    │ ────────────────────────────────────────┐                │
    │                                         │                │
    │ 10. Display Profile                     │                │
    └─────────────────────────────────────────┘                │
```

#### 2. Verifiable Credential Issuance Flow

```
┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐
│  Subject │        │  Issuer  │        │ Contract │        │   IPFS   │
│  (User)  │        │          │        │ Registry │        │          │
└────┬─────┘        └────┬─────┘        └────┬─────┘        └────┬─────┘
     │                   │                   │                   │
     │ 1. Request        │                   │                   │
     │   Credential      │                   │                   │
     ├──────────────────▶│                   │                   │
     │                   │                   │                   │
     │                   │ 2. Review Request │                   │
     │                   │ ────────────────┐ │                   │
     │                   │                 │ │                   │
     │                   │ 3. Approve      │ │                   │
     │                   │ ◀───────────────┘ │                   │
     │                   │                   │                   │
     │                   │ 4. Create W3C     │                   │
     │                   │    Credential     │                   │
     │                   │    JSON           │                   │
     │                   │ ────────────────┐ │                   │
     │                   │                 │ │                   │
     │                   │ 5. Upload to    │ │                   │
     │                   │    IPFS         │ │                   │
     │                   ├─────────────────┼─┼──────────────────▶│
     │                   │                 │ │                   │
     │                   │ 6. Returns CID  │ │                   │
     │                   │◀────────────────┼─┼───────────────────│
     │                   │                 │ │                   │
     │                   │ 7. Issue        │ │                   │
     │                   │    Credential   │ │                   │
     │                   ├─────────────────┼─▶                   │
     │                   │                 │ │                   │
     │                   │                 │ │ 8. Store          │
     │                   │                 │ │    Metadata       │
     │                   │                 │ │    & CID          │
     │                   │                 │ │ ────────────────┐ │
     │                   │                 │ │                 │ │
     │                   │ 9. Emit Event   │ │                 │ │
     │                   │◀────────────────┼─┤◀────────────────┘ │
     │                   │                 │ │                   │
     │ 10. Notification  │                 │ │                   │
     │◀──────────────────┤                 │ │                   │
     │                   │                 │ │                   │
     │ 11. Fetch         │                 │ │                   │
     │     Credential    │                 │ │                   │
     ├─────────────────────────────────────┼─┼──────────────────▶│
     │                   │                 │ │                   │
     │ 12. Display in    │                 │ │                   │
     │     Profile       │                 │ │                   │
     │◀────────────────────────────────────┼─┼───────────────────│
     │                   │                 │ │                   │
```

#### 3. Credential Verification Flow

```
┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐
│ Verifier │        │  Subject │        │ Contract │        │   IPFS   │
│          │        │  (User)  │        │ Registry │        │          │
└────┬─────┘        └────┬─────┘        └────┬─────┘        └────┬─────┘
     │                   │                   │                   │
     │ 1. Request        │                   │                   │
     │    Credential     │                   │                   │
     │    Proof          │                   │                   │
     ├──────────────────▶│                   │                   │
     │                   │                   │                   │
     │                   │ 2. Share          │                   │
     │                   │    Credential ID  │                   │
     │◀──────────────────│    or CID         │                   │
     │                   │                   │                   │
     │ 3. Verify Status  │                   │                   │
     │    On-Chain       │                   │                   │
     ├───────────────────────────────────────▶                   │
     │                   │                   │                   │
     │ 4. Return Status  │                   │                   │
     │    (Active/       │                   │                   │
     │     Revoked/      │                   │                   │
     │     Expired)      │                   │                   │
     │◀──────────────────────────────────────│                   │
     │                   │                   │                   │
     │ 5. Fetch Full     │                   │                   │
     │    Credential     │                   │                   │
     │    from IPFS      │                   │                   │
     ├───────────────────────────────────────────────────────────▶
     │                   │                   │                   │
     │ 6. Return         │                   │                   │
     │    Credential     │                   │                   │
     │    JSON           │                   │                   │
     │◀──────────────────────────────────────────────────────────│
     │                   │                   │                   │
     │ 7. Verify         │                   │                   │
     │    - Issuer Sig   │                   │                   │
     │    - Content Hash │                   │                   │
     │    - Expiration   │                   │                   │
     │ ────────────────┐ │                   │                   │
     │                 │ │                   │                   │
     │ 8. Accept/      │ │                   │                   │
     │    Reject       │ │                   │                   │
     │◀────────────────┘ │                   │                   │
     │                   │                   │                   │
```

### Security & Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                      ACCESS CONTROL MATRIX                      │
├──────────────┬──────────┬──────────┬──────────┬─────────────────┤
│   Action     │   User   │  Issuer  │  Owner   │    Verifier     │
├──────────────┼──────────┼──────────┼──────────┼─────────────────┤
│ Create ID    │    ✅    │    ✅     │    ✅    │       ✅        │
│ Update ID    │    ✅    │    ❌     │    ❌    │       ❌        │
│ View ID      │    ✅    │    ✅     │    ✅    │       ✅        │
│ Add Issuer   │    ❌    │    ❌     │    ✅    │       ❌        │
│ Issue Cred   │    ❌    │    ✅     │    ❌    │       ❌        │
│ Revoke Cred  │  ✅(own) │ ✅(iss)   │    ❌    │       ❌        │
│ View Cred    │    ✅    │    ✅     │    ✅    │       ✅        │
│ Request Cred │    ✅    │    ✅     │    ✅    │       ❌        │
│ Approve Req  │    ❌    │    ✅     │    ❌    │       ❌        │
└──────────────┴──────────┴──────────┴──────────┴─────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Additional Requirements

- **Sepolia Testnet ETH** - [Get from faucet](https://sepoliafaucet.com/) or [Alchemy faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- **WalletConnect Project ID** - [Register at WalletConnect Cloud](https://cloud.walletconnect.com/)
- **Alchemy API Key** - [Create account at Alchemy](https://www.alchemy.com/)
- **Pinata Account** - [Sign up at Pinata](https://pinata.cloud/) for IPFS pinning services
  - API Key
  - Secret API Key
  - JWT Token
  - Dedicated Gateway URL

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

# Pinata Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_PINATA_JWT=your_pinata_jwt_token
VITE_DEDICATED_GATEWAY_URL=https://your-gateway.mypinata.cloud

# Verifiable Credentials Contracts
VITE_CREDENTIAL_REGISTRY_ADDRESS=0xYourCredentialRegistryAddress
VITE_CREDENTIAL_REQUEST_ADDRESS=0xYourCredentialRequestAddress
```

#### Getting Pinata Credentials

1. **Sign up at [Pinata](https://pinata.cloud/)**
2. **Navigate to API Keys section**
3. **Create New Key** with pinning permissions
4. **Copy API Key and Secret Key**
5. **Get JWT Token** from the same section
6. **Set up Dedicated Gateway**:
   - Go to Gateways section
   - Create or copy your dedicated gateway URL
   - This provides faster, more reliable access to your pinned content

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

#### 1. **Connect Wallet**
   - Click "Connect Wallet" button on homepage
   - Select MetaMask or use WalletConnect for other wallets
   - Approve connection request in your wallet
   - Ensure you're connected to Sepolia testnet

#### 2. **Create Your Identity**
   
   Follow the 6-step wizard to create your comprehensive digital identity.

#### 3. **Request Verifiable Credentials**
   - Click "Request a Credential" button
   - Enter the issuer's wallet address
   - Specify credential type (e.g., "UniversityDegreeCredential")
   - Provide reason for request
   - Submit and wait for issuer approval

#### 4. **View & Manage**
   - Your identity displays automatically after creation
   - All data organized in clean, categorized cards
   - View IPFS CIDs for verification
   - See your verifiable credentials with status indicators
   - Click "Edit Profile" to update any information
   - Revoke credentials if needed

### For Credential Issuers

#### 1. **Get Authorized**
   - Contact the platform administrator
   - Provide your wallet address
   - Administrator runs authorization script
   - Your wallet is now authorized to issue credentials

#### 2. **Access Issuer Dashboard**
   - Connect your authorized wallet
   - "Issue Credential" button appears in header
   - Access "View Requests" to see incoming credential requests

#### 3. **Issue Credentials**
   - Click "Approve & Issue" or "Issue Credential"
   - Fill in credential details
   - Submit - credential data uploaded to IPFS
   - Approve blockchain transaction
   - Credential immediately visible to subject

## 📁 Project Structure

```
decentralized-identity/
│
├── contracts/                        # Smart Contracts
│   ├── Identity.sol                  # Main identity smart contract
│   ├── CredentialRegistry.sol        # Verifiable credentials registry
│   └── CredentialRequest.sol         # Credential request system
│
├── scripts/                          # Deployment & Management Scripts
│   ├── deploy.js                     # Identity contract deployment
│   ├── deploy_credentials.js         # CredentialRegistry deployment
│   ├── deploy_requests.js            # CredentialRequest deployment
│   └── add_issuer.js                 # Script to authorize credential issuers
│
├── test/                             # Smart Contract Tests
│   └── Identity.test.js              # Identity contract test suite
│
├── docs/                             # Documentation
│   └── verifiable-credentials.md     # VC implementation documentation
│
├── client/                           # React Frontend Application
│   ├── public/                       # Static assets
│   │
│   ├── src/
│   │   │
│   │   ├── components/               # React Components
│   │   │   ├── Header.jsx           # Navigation header with wallet info
│   │   │   ├── WelcomeScreen.jsx    # Landing page
│   │   │   ├── HowToUse.jsx         # Usage instructions
│   │   │   ├── ProfileEditor.jsx    # 6-step profile creation wizard
│   │   │   ├── ProfileViewer.jsx    # Profile display with credentials
│   │   │   ├── IssueCredential.jsx  # Credential issuance form (issuer)
│   │   │   ├── RequestCredential.jsx # Credential request form (user)
│   │   │   ├── IssuerDashboard.jsx  # Issuer request management
│   │   │   │
│   │   │   └── ui/                  # Reusable UI Components
│   │   │       ├── FormField.jsx    # Unified form field component
│   │   │       └── StepIndicator.jsx # Wizard step indicator
│   │   │
│   │   ├── hooks/                   # Custom React Hooks
│   │   │   ├── useDebounce.js       # Debounce hook for auto-save
│   │   │   └── useOnClickOutside.js # Click outside detection
│   │   │
│   │   ├── schemas/                 # Validation Schemas
│   │   │   └── profileSchema.js     # Zod validation schema for profiles
│   │   │
│   │   ├── services/                # External Services Integration
│   │   │   └── ipfs.js              # IPFS/Pinata integration service
│   │   │
│   │   ├── App.jsx                  # Main application component
│   │   ├── config.js                # Contract addresses & ABIs
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles (Tailwind)
│   │
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite build configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── package.json                 # Frontend dependencies
│   └── .env                         # Frontend environment variables
│
├── artifacts/                        # Compiled contract artifacts (generated)
├── cache/                            # Hardhat cache (generated)
├── node_modules/                     # Dependencies (generated)
│
├── hardhat.config.js                # Hardhat configuration
├── package.json                     # Backend dependencies
├── .env                             # Root environment variables
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
└── README.md                        # Project documentation
```

## 📝 Smart Contract Details

### Identity.sol

The identity contract stores only IPFS hashes on-chain for gas efficiency:

**Key Functions:**
- `createIdentity(string _ipfsHash)` - Creates new identity
- `updateIdentity(string _newIpfsHash)` - Updates existing identity
- `identities(address)` - View identity data

### CredentialRegistry.sol

Manages the lifecycle of W3C Verifiable Credentials:

**Key Functions:**
- `addIssuer(address, string)` - Authorizes new credential issuer (owner only)
- `issueCredential(...)` - Issues verifiable credential to subject (issuer only)
- `revokeCredential(bytes32)` - Revokes credential (issuer or subject)
- `getCredentialStatus(bytes32)` - Returns credential validity status

### CredentialRequest.sol

Facilitates credential requests between users and issuers:

**Key Functions:**
- `createRequest(...)` - User requests credential from issuer
- `approveRequest(uint256)` - Issuer approves request
- `rejectRequest(uint256)` - Issuer rejects request
- `getRequestsByIssuer(address)` - Returns all requests for an issuer

### Security Features

**Identity Contract:**
- ✅ One identity per address enforcement
- ✅ No centralized owner/admin control
- ✅ Gas-efficient storage (only CID on-chain)

**CredentialRegistry Contract:**
- ✅ Owner-controlled issuer authorization
- ✅ Issuer-only credential issuance
- ✅ Subject/issuer revocation rights
- ✅ Expiration date tracking
- ✅ Unique credential IDs

**CredentialRequest Contract:**
- ✅ Validates issuers against registry
- ✅ Issuer-only approval/rejection
- ✅ Request status tracking

## 📦 IPFS Integration

### How It Works

DecentraID uses IPFS (InterPlanetary File System) for decentralized data storage:

1. **Content Addressing**: Each piece of content gets a unique hash (CID)
2. **Immutability**: Content cannot be changed without changing the CID
3. **Decentralization**: No single point of failure
4. **Privacy**: Data encrypted and distributed across nodes

### Pinata Service

We use Pinata for reliable IPFS pinning:

- **Pinning**: Ensures your data remains available on IPFS
- **Dedicated Gateway**: Fast, reliable access to pinned content
- **API Integration**: Easy uploads via RESTful API
- **File Management**: Track and manage all uploaded files

### Benefits of IPFS Storage

- 📉 **Lower Gas Costs**: Only hash stored on-chain
- 🔒 **Enhanced Privacy**: Full data not visible on blockchain
- 📈 **Scalability**: No blockchain bloat with large data
- 🌍 **Availability**: Distributed across global network
- ✅ **Verifiability**: Content hash ensures data integrity

## 🪪 Verifiable Credentials

DecentraID implements the **W3C Verifiable Credentials** standard, enabling trusted third parties to issue tamper-proof digital attestations.

### How It Works

1. **Issuer Authorization** - Platform administrator authorizes trusted issuers
2. **Credential Request** - Users request credentials from authorized issuers
3. **Issuance** - Issuer creates W3C-compliant credential and uploads to IPFS
4. **On-Chain Registry** - Smart contract records credential metadata and IPFS hash
5. **Verification** - Anyone can verify credential status on blockchain
6. **Revocation** - Credentials can be revoked by issuer or subject

### Benefits

- ✅ Instant verification without contacting issuer
- ✅ Tamper-proof cryptographic security
- ✅ Privacy-preserving (full data off-chain)
- ✅ Standards-compliant (W3C)
- ✅ Portable across platforms

For detailed documentation, see [docs/verifiable-credentials.md](docs/verifiable-credentials.md)

## 🔒 Security & Privacy Considerations

### Smart Contract Security

- **Reentrancy Protection**: Not needed (no external calls or fund transfers)
- **Access Control**: User-specific operations only (msg.sender validation)
- **Input Validation**: IPFS hash length and existence checks
- **State Management**: Simple mapping structure minimizes attack surface
- **No Owner Privileges**: Fully decentralized with no admin functions

### Best Practices Implemented

✅ Use of `require()` statements for input validation  
✅ Event emission for transparency and off-chain tracking  
✅ Minimal external dependencies  
✅ No use of `selfdestruct`, `delegatecall`, or `tx.origin`  
✅ Simple, auditable code structure  
✅ Gas-optimized operations  
✅ Comprehensive error messages  

### Privacy Considerations

#### On-Chain Data
- ⚠️ **Only IPFS hash stored on-chain** - The blockchain stores no personal information
- ✅ **Public visibility** - Anyone can see which addresses have identities and their IPFS hashes
- ✅ **Pseudonymous** - Wallet addresses don't inherently reveal real-world identity

#### Off-Chain Data (IPFS)
- 🔒 **IPFS data is publicly accessible** - Anyone with the CID can retrieve the data
- 📊 **Trade-off**: Convenience vs. Privacy
  - Current implementation prioritizes usability
  - Data is human-readable JSON on IPFS
  - Suitable for professional profiles and public credentials

#### Production-Ready Privacy Enhancements

For production use with sensitive data, consider:

1. **Encryption**: 
   - Encrypt profile data before uploading to IPFS
   - Use user's private key or shared secrets
   - Only authorized parties can decrypt

2. **Selective Disclosure**:
   - Zero-knowledge proofs for attribute verification
   - Prove claims without revealing underlying data
   - Example: Prove "over 18" without revealing birthdate

3. **Private IPFS Networks**:
   - Use private IPFS clusters
   - Restrict access to authorized nodes
   - Enterprise-grade privacy

4. **Hash-Based Commitments**:
   - Store hashed attributes on-chain
   - Reveal data only when necessary
   - Verifiable without exposure

### User Security Guidelines

#### Wallet Security
1. **Never share your private key or seed phrase**
2. **Use hardware wallets** (Ledger, Trezor) for production
3. **Enable MetaMask security features** (phishing detection, transaction simulation)
4. **Keep wallet software updated**
5. **Use strong passwords** and 2FA where available

#### DApp Usage
1. **Verify contract addresses** before interacting
2. **Review transactions** carefully before signing
3. **Be cautious with sensitive information** - remember IPFS data is public
4. **Use test wallets** for development and testing
5. **Backup your data** independently

#### Personal Data
1. **Don't upload highly sensitive documents** without encryption
2. **Be aware** all IPFS content can be accessed by anyone with the CID
3. **Consider privacy implications** before creating profiles
4. **Use pseudonyms** if you want additional privacy
5. **Review data** before submitting transactions

### Known Limitations

1. **No Data Deletion**: Once on blockchain/IPFS, data cannot be fully deleted
2. **Public IPFS**: All profile data is publicly accessible via CID
3. **No Access Control**: Anyone can read identities if they know the wallet address
4. **Gas Costs**: Users pay gas fees for all transactions
5. **Network Dependency**: Requires Ethereum network availability

#### For Users
- ✅ Only use test ETH and test data during development
- ✅ Verify you're on Sepolia testnet (Chain ID: 11155111)
- ✅ Review all permissions before granting access
- ✅ Keep private keys secure and never share them
- ✅ Understand that blockchain transactions are irreversible

## 🚀 Future Enhancements

### Planned Features

#### Phase 1: Core Improvements

1. **Enhanced Privacy**
   - Client-side encryption before IPFS upload
   - Zero-knowledge proof integration
   - Selective attribute disclosure
   - Private data compartments

2. **Social Recovery**
   - Guardian-based account recovery
   - Multi-signature approval process
   - Protection against key loss
   - Time-locked recovery mechanisms

#### Phase 2: Advanced Features
3. **DID Standards Compliance**
   - W3C Decentralized Identifier (DID) specification
   - DID Document management
   - Universal resolver integration
   - Cross-chain DID portability

4. **Reputation System**
   - On-chain reputation scoring
   - Endorsements from other users
   - Skill verification
   - Activity-based reputation

5. **ENS Integration**
   - Link human-readable .eth names
   - Improved user experience
   - Identity resolution via ENS
   - Reverse resolution support

#### Phase 3: Ecosystem Growth
6. **Multi-Chain Deployment**
   - Deploy on Polygon for lower fees
   - Arbitrum and Optimism support
   - Cross-chain identity bridging
   - Chain-agnostic identity management

7. **DAO Governance**
   - Community-driven protocol upgrades
   - Voting mechanisms for features
   - Decentralized decision making
   - Treasury management

8. **Mobile Application**
   - Native iOS and Android apps
   - Biometric authentication
   - QR code identity sharing
   - Push notifications for updates

#### Phase 4: Enterprise Features
9. **Organization Support**
    - Company/organization profiles
    - Employee credential issuance
    - Role-based access control
    - Bulk identity management

10. **API & SDK**
    - RESTful API for integration
    - JavaScript/TypeScript SDK
    - Python library
    - Documentation and examples

11. **Analytics Dashboard**
    - Identity statistics
    - Network insights
    - Usage metrics
    - Visualization tools

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aayush Chouhan**

- Major Project: Decentralized Digital Identity Management
- Date: October 7, 2025

## 📚 Resources

### Documentation
- [Ethereum Documentation](https://ethereum.org/developers)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [React Documentation](https://react.dev/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [W3C DID Specification](https://www.w3.org/TR/did-core/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

**⭐ If you find this project useful, please consider giving it a star!**

**🔗 For detailed information about Verifiable Credentials implementation, see [docs/verifiable-credentials.md](docs/verifiable-credentials.md)**
