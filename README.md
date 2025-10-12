# DecentraID - Decentralized Digital Identity Management

A blockchain-based Self-Sovereign Identity (SSI) solution built on Ethereum that empowers users to create, manage, and own their digital identity without reliance on centralized intermediaries. DecentraID combines the immutability of blockchain with the privacy and scalability of IPFS to create a truly decentralized identity management system, now featuring **W3C Verifiable Credentials** for tamper-proof digital attestations, **Client-side Encryption** for enhanced privacy, and **Social Recovery** for secure account recovery.

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New](#-whats-new)
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
- [Client-Side Encryption](#-client-side-encryption)
- [Social Recovery](#-social-recovery)
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
- **Privacy-First** - Client-side encryption ensures your data remains private
- **Recovery Protection** - Guardian-based social recovery protects against key loss

### Problem Statement

Current digital identity systems suffer from:
- ❌ Lack of user control over personal data
- ❌ Data silos preventing identity portability
- ❌ Centralized databases as targets for large-scale breaches
- ❌ Privacy concerns with data monetization
- ❌ Difficulty verifying credentials without contacting issuers
- ❌ No protection against wallet key loss

### Our Solution

✅ Self-Sovereign Identity (SSI) using Ethereum and IPFS  
✅ Cryptographic wallet-based authentication  
✅ User-controlled creation and updates of a rich, off-chain profile  
✅ An immutable on-chain registry that stores only content-addressed hashes (IPFS CID)  
✅ W3C-compliant Verifiable Credentials for trusted attestations  
✅ Decentralized credential issuance, verification, and revocation  
✅ **Client-side AES-GCM encryption** for maximum privacy  
✅ **Social Recovery system** with multi-guardian protection 

## 🎉 What's New

### ✨ Recently Implemented Features

#### 🔐 Client-Side Encryption (NEW!)
- **End-to-end encryption** - All profile data encrypted before IPFS upload
- **Wallet-derived keys** - Encryption keys derived from your wallet signature
- **AES-GCM encryption** - Industry-standard authenticated encryption
- **Backward compatible** - Seamlessly handles both encrypted and legacy plaintext data
- **Zero server-side access** - Only you can decrypt your profile data

#### 🛡️ Social Recovery System (NEW!)
- **Guardian-based recovery** - Designate trusted addresses to help recover your account
- **Multi-signature approval** - Configurable threshold (e.g., 2-of-3 guardians)
- **Time-locked execution** - 60-second timelock prevents hasty recoveries
- **Personal recovery contracts** - Each user deploys their own recovery contract
- **Full ownership transfer** - Seamlessly transfer identity ownership during recovery
- **Cancel protection** - Current owner can cancel unauthorized recovery attempts

#### 🔄 Enhanced Credential Request System (NEW!)
- **Direct credential requests** - Request credentials from any authorized issuer
- **Issuer dashboard** - Dedicated interface for managing incoming requests
- **Approve & Issue workflow** - Streamlined process from request to credential
- **Request tracking** - View status of all your credential requests

## ✨ Features

### Core Identity Management
- 🔑 **Multi-Wallet Support** - Connect using MetaMask or any WalletConnect-compatible wallet
- 🖼️ **Rich Profile Management** - Create comprehensive profiles with personal, professional, educational, and social information
- 🔄 **Identity Updates** - Seamlessly update your profile by uploading new data to IPFS
- 💾 **Decentralized Storage** - All profile data stored on IPFS for privacy and cost-efficiency
- 📁 **File Uploads** - Support for profile photos, resumes, and identity documents
- 🔗 **On-Chain Verification** - Smart contract stores only IPFS hashes as immutable pointers
- 🌐 **Fully Decentralized** - No central authority with all operations verifiable on blockchain

### Enhanced Privacy Features (NEW!)
- 🔐 **Client-Side Encryption** - AES-GCM encryption of all profile data before IPFS upload
- 🔑 **Wallet-Derived Keys** - Encryption keys derived from your wallet signature
- 🛡️ **Private Data** - Only you can decrypt your profile with your wallet
- 🔒 **Encrypted IPFS Storage** - Data on IPFS is encrypted and unreadable without your key
- ✅ **Transparent Encryption** - Automatic encryption/decryption with no user friction

### Social Recovery (NEW!)
- 👥 **Guardian Management** - Add trusted addresses as recovery guardians
- 🔢 **Configurable Threshold** - Set minimum number of guardian approvals (e.g., 2-of-3)
- ⏱️ **Time-Locked Recovery** - 60-second cooldown period before execution
- 🎯 **Personal Recovery Contracts** - Each user deploys their own recovery smart contract
- 🔄 **Ownership Transfer** - Seamlessly transfer identity ownership to a new wallet
- ❌ **Cancel Protection** - Current owner can cancel unauthorized recovery attempts
- 📊 **Recovery Dashboard** - Monitor active recovery attempts and guardian approvals

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

### Security & Privacy
- **Web Crypto API** - Browser-native cryptographic operations
- **AES-GCM Encryption** - Authenticated encryption with associated data
- **Wallet-Derived Keys** - Deterministic key generation from wallet signatures

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

The updated architecture separates on-chain logic from off-chain data, providing a scalable and private solution with support for verifiable credentials, client-side encryption, and social recovery.

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
│  │   Profile    │  │    Issue     │  │    Setup     │             │
│  │   Viewer     │  │  Credential  │  │   Recovery   │  (NEW!)     │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                               │
│  │   Social     │  │   How To     │                               │
│  │   Recovery   │  │     Use      │                               │
│  └──────────────┘  └──────────────┘                               │
│       (NEW!)                                                      │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                     ENCRYPTION LAYER (NEW!)                    │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Client-Side AES-GCM Encryption Service                 │   │
│  │  ┌────────────────┐  ┌────────────────┐                 │   │
│  │  │ Wallet Signing │─▶│ Key Derivation │                 │   │
│  │  │   (Message)    │  │  (keccak256)   │                 │   │
│  │  └────────────────┘  └────────┬───────┘                 │   │
│  │                               │                         │   │
│  │  ┌────────────────┐  ┌────────▼───────┐                 │   │
│  │  │   Random IV    │  │   AES-GCM      │                 │   │
│  │  │  Generation    │─▶│  Encryption    │                 │   │
│  │  └────────────────┘  └────────────────┘                 │   │
│  │  • Wallet-derived signing key (deterministic)           │   │
│  │  • Random IV per encryption (12 bytes)                  │   │
│  │  • Authenticated encryption (tamper-proof)              │   │
│  │  • Browser-native Web Crypto API                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬───────────────────────────────────┘
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
│  │ - Set Owner  │  └──────────────┘  └──────────────┘             │
│  │ - Delegation │           (NEW!)                                │
│  └──────┬───────┘                                                 │
│         │                                                         │
│         │  ┌──────────────────────────────────────┐               │
│         └─▶│   Social Recovery Contract (NEW!)    │               │
│            │  ┌────────────────────────────────┐  │               │
│            │  │ • Guardian Management          │  │               │
│            │  │ • Threshold Configuration      │  │               │
│            │  │ • Recovery Initiation          │  │               │
│            │  │ • Multi-sig Approval           │  │               │
│            │  │ • Time-locked Execution (60s)  │  │               │
│            │  │ • Cancel Protection            │  │               │
│            │  │ • Ownership Transfer           │  │               │
│            │  │ • Identity Update Proxy        │  │               │
│            │  └────────────────────────────────┘  │               │
│            └──────────────────────────────────────┘               │
│                                                                   │
│              Ethereum Blockchain (Sepolia Testnet)                │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER (IPFS)                          │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Encrypted   │  │  Credential  │  │    Files     │              │
│  │   Profile    │  │     JSON     │  │  (Photos,    │              │
│  │     JSON     │  │  (W3C Comp)  │  │  Documents)  │              │
│  │              │  │              │  │              │              │
│  │ {            │  │              │  │              │              │
│  │   iv: "...", │  │              │  │              │              │
│  │   data: "..}"│  │              │  │              │              │
│  │   (AES-GCM)  │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│       (NEW!)                                                       │
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
│  ┌────────────────┐    ┌────────────────┐   (NEW!)            │
│  │  Encryption    │───▶│  Web Crypto    │                     │
│  │    Service     │    │      API       │                     │
│  └────────────────┘    └────────────────┘                     │
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
└──────┬──────┘         └─────────────┘        └─────────────┘
       │                       │                       │
       │ (NEW!)                ▼                       │
       │                ┌─────────────┐                │
       │                │   Issuer    │                │
       │                │  Approval   │                │
       │                └─────────────┘                │
       │                                               │
       │ Ownership Delegation (NEW!)                   │
       ▼                                               │
┌─────────────┐                                        │
│   Social    │                                        │
│  Recovery   │                                        │
│  Contract   │                                        │
│             │                                        │
│ - Guardians │                                        │
│ - Threshold │                                        │
│ - Timelock  │                                        │
└──────┬──────┘                                        │
       │                                               │
       └───────────────────┬───────────────────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │    IPFS     │
                   │  (Storage)  │
                   │ (Encrypted) │
                   └─────────────┘
```

### Security & Access Control

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ACCESS CONTROL MATRIX                              │
├──────────────┬──────────┬──────────┬──────────┬───────────┬─────────────┤
│   Action     │   User   │  Issuer  │  Owner   │ Guardian  │  Verifier   │
├──────────────┼──────────┼──────────┼──────────┼───────────┼─────────────┤
│ Create ID    │    ✅    │    ✅     │    ✅    │    ✅     │     ✅      │
│ Update ID    │    ✅    │    ❌     │    ❌    │    ❌     │     ❌      │
│ View ID      │    ✅    │    ✅     │    ✅    │    ✅     │     ✅      │
│ Decrypt ID   │  ✅(own) │    ❌     │    ❌    │    ❌     │     ❌      │
│              │          │          │          │           │            │
│ Add Issuer   │    ❌    │    ❌     │    ✅    │    ❌     │     ❌      │
│ Issue Cred   │    ❌    │    ✅     │    ❌    │    ❌     │     ❌      │
│ Revoke Cred  │  ✅(own) │ ✅(iss)   │    ❌    │    ❌     │     ❌      │
│ View Cred    │    ✅    │    ✅     │    ✅    │    ✅     │     ✅      │
│ Request Cred │    ✅    │    ✅     │    ✅    │    ✅     │     ❌      │
│ Approve Req  │    ❌    │    ✅     │    ❌    │    ❌     │     ❌      │
│              │          │          │          │           │            │
│ Setup Recov  │  ✅(own) │    ❌     │    ❌    │    ❌     │     ❌      │
│ Add Guardian │  ✅(own) │    ❌     │    ❌    │    ❌     │     ❌      │
│ Start Recov  │    ❌    │    ❌     │    ❌    │    ✅     │     ❌      │
│ Support Rec  │    ❌    │    ❌     │    ❌    │    ✅     │     ❌      │
│ Cancel Recov │    ❌    │    ❌     │ ✅(curr) │    ❌     │     ❌      │
│ Execute Rec  │    ✅    │    ✅     │    ✅    │    ✅     │     ✅      │
│ Update via   │    ❌    │    ❌     │    ❌    │    ❌     │     ❌      │
│  Recovery    │          │          │ ✅(rec)  │           │            │
└──────────────┴──────────┴──────────┴──────────┴───────────┴────────────┘

Legend:
- ✅(own) = Only for own resources
- ✅(iss) = Only for credentials they issued
- ✅(curr) = Current owner only
- ✅(rec) = Via recovery contract only
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
CREDENTIAL_REGISTRY_ADDRESS=0xYourCredentialRegistryAddress
METAMASK_WALLET_ADDRESS=0xYourWalletAddress
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

# Social Recovery (NEW!)
VITE_SOCIAL_RECOVERY_CONTRACT_BYTECODE=your_compiled_bytecode_here
```

## 🚀 Running the Project

### Step 1: Compile Smart Contracts

```bash
npx hardhat compile
```

This compiles the Solidity smart contracts and generates artifacts.

### Step 2: Run Tests (Optional but Recommended)

```bash
npx hardhat test
```

### Step 3: Deploy to Sepolia Testnet

```bash
# Deploy Identity Contract
npx hardhat run scripts/deploy.js --network sepolia

# Deploy Credential Registry
npx hardhat run scripts/deploy_credentials.js --network sepolia

# Deploy Credential Request System
npx hardhat run scripts/deploy_requests.js --network sepolia
```

Save the deployed contract addresses from the output.

### Step 4: Authorize an Issuer (For Credential System)

Update the `.env` file with your wallet address and run:

```bash
npx hardhat run scripts/add_issuer.js --network sepolia
```

### Step 5: Update Frontend Configuration

Update `client/.env` with your deployed contract addresses.

### Step 6: Start Frontend Development Server

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 7: Configure MetaMask

1. Open MetaMask
2. Add Sepolia test network (if not already added)
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Connect to your DApp


## 📖 Usage Guide

### For End Users

#### 1. **Connect Wallet**
   - Click "Connect Wallet" button on homepage
   - Select MetaMask or use WalletConnect for other wallets
   - Approve connection request in your wallet
   - Ensure you're connected to Sepolia testnet

#### 2. **Create Your Identity**
   
   Follow the 6-step wizard to create your comprehensive digital identity. **Your data is automatically encrypted** before being uploaded to IPFS.

#### 3. **Setup Social Recovery (NEW!)**
   - Navigate to your profile
   - Click "Setup Social Recovery"
   - Add trusted guardian addresses (friends, family, other wallets)
   - Set recovery threshold (e.g., 2 out of 3 guardians)
   - Deploy your personal recovery contract
   - Your identity is now protected against key loss!

#### 4. **Request Verifiable Credentials**
   - Click "Request a Credential" button
   - Enter the issuer's wallet address
   - Specify credential type (e.g., "UniversityDegreeCredential")
   - Provide reason for request
   - Submit and wait for issuer approval

#### 5. **View & Manage**
   - Your encrypted identity displays automatically after creation
   - All data organized in clean, categorized cards
   - View IPFS CIDs for verification
   - See your verifiable credentials with status indicators
   - Click "Edit Profile" to update any information
   - Revoke credentials if needed
   - Manage your social recovery settings

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

### For Recovery Guardians (NEW!)

#### 1. **Being Added as a Guardian**
   - A user adds your wallet address as their guardian
   - No action required from you initially
   - You'll need to monitor for recovery requests

#### 2. **Initiating Recovery**
   - If the account owner loses access, any guardian can start recovery
   - Navigate to the recovery management interface
   - Propose a new owner address (the recovered wallet)
   - Other guardians must approve

#### 3. **Approving Recovery**
   - Check for active recovery requests
   - Review the proposed new owner address
   - Approve if legitimate
   - Once threshold is met, a 60-second timelock begins
   - Anyone can execute after timelock expires

## 🔐 Client-Side Encryption

### How It Works

DecentraID implements **end-to-end encryption** for all profile data:

1. **Key Derivation**
   - User signs a deterministic message with their wallet
   - Signature is hashed to create a 256-bit encryption key
   - Same wallet always produces the same key

2. **Encryption Process**
   - Profile data is serialized to JSON
   - AES-GCM authenticated encryption is applied
   - Random IV (Initialization Vector) generated per encryption
   - Encrypted data + IV uploaded to IPFS

3. **Decryption Process**
   - Fetch encrypted data from IPFS
   - User signs the same deterministic message
   - Derive decryption key from signature
   - Decrypt using AES-GCM with stored IV
   - Display decrypted profile

### Benefits

- 🔒 **True Privacy** - Data on IPFS is encrypted and unreadable
- 🔑 **User Control** - Only the wallet owner can decrypt
- 🛡️ **No Key Storage** - Keys derived on-demand, never stored
- ✅ **Transparent** - Automatic encryption/decryption
- 📦 **Backward Compatible** - Handles legacy plaintext data

### Technical Details

```javascript
// Encryption (client/src/services/encryption.js)
- Algorithm: AES-GCM (256-bit)
- IV: 12 bytes, randomly generated
- Key Derivation: keccak256(walletSignature)
- Authentication: Built into AES-GCM
```

## 🛡️ Social Recovery

### Overview

Social Recovery is a **guardian-based account recovery system** that protects users from losing access to their identity if they lose their wallet private key.

### How It Works

1. **Setup Phase**
   - User deploys a personal `SocialRecovery` smart contract
   - Adds trusted guardians (other Ethereum addresses)
   - Sets recovery threshold (e.g., 2-of-3 guardians required)
   - Transfers identity ownership to the recovery contract

2. **Normal Operation**
   - User interacts with their identity through the recovery contract
   - Recovery contract acts as a proxy to the identity contract
   - All permissions flow through the recovery contract

3. **Recovery Process**
   - User loses access to their wallet
   - Any guardian initiates recovery with a new wallet address
   - Other guardians approve the recovery
   - Once threshold is met, a **60-second timelock** begins
   - After timelock, anyone can execute the recovery
   - Identity ownership transfers to the new wallet

4. **Protection Mechanisms**
   - **Timelock** prevents instant unauthorized transfers
   - **Current owner** can cancel recovery attempts
   - **Multi-signature** requires multiple guardians to collude
   - **Transparent** - all actions visible on-chain

### Use Cases

- 🔑 **Lost private key** - Recover identity with guardians
- 📱 **Device theft** - Transfer to new wallet immediately
- 👴 **Estate planning** - Designated heirs can recover
- 🔐 **Corporate accounts** - Multi-sig for organizations

## 🔒 Security & Privacy Considerations

### Client-Side Encryption Security

✅ **Wallet-derived keys** - Encryption keys never leave the browser  
✅ **AES-GCM authentication** - Prevents tampering  
✅ **Random IVs** - Each encryption uses unique initialization vector  
✅ **Deterministic key derivation** - Same wallet always produces same key  
✅ **No server-side access** - Only you can decrypt your data  

### Social Recovery Security

✅ **Timelock protection** - 60-second delay prevents instant attacks  
✅ **Cancel mechanism** - Current owner can stop unauthorized recovery  
✅ **Multi-signature requirement** - Multiple guardians must agree  
✅ **Immutable guardians** - Guardian list set at deployment  
✅ **Transparent process** - All recovery attempts visible on-chain  

### Smart Contract Security

- **Reentrancy Protection**: Not needed (no external calls or fund transfers)
- **Access Control**: User-specific operations only (msg.sender validation)
- **Input Validation**: IPFS hash length and existence checks
- **State Management**: Simple mapping structure minimizes attack surface
- **No Owner Privileges**: Fully decentralized with limited admin functions

### Privacy Considerations

#### On-Chain Data
- ⚠️ **Only IPFS hash stored on-chain** - The blockchain stores no personal information
- ✅ **Encrypted data** - Profile data is encrypted before IPFS upload
- ✅ **Public visibility** - Anyone can see which addresses have identities and their IPFS hashes
- ✅ **Pseudonymous** - Wallet addresses don't inherently reveal real-world identity

#### Off-Chain Data (IPFS)
- 🔐 **Encrypted on IPFS** - Data is encrypted and unreadable without wallet key
- ✅ **Privacy-by-default** - All new profiles use client-side encryption
- 🛡️ **Wallet-gated access** - Only wallet owner can decrypt
- 📦 **Backward compatible** - Old plaintext profiles still accessible

### Best Practices Implemented

✅ Use of `require()` statements for input validation  
✅ Event emission for transparency and off-chain tracking  
✅ Minimal external dependencies  
✅ No use of `selfdestruct`, `delegatecall`, or `tx.origin`  
✅ Simple, auditable code structure  
✅ Gas-optimized operations  
✅ Comprehensive error messages  
✅ Client-side encryption by default  
✅ Time-locked recovery mechanisms  

## 📁 Project Structure

```
decentralized-identity/
│
├── contracts/                        # Smart Contracts
│   ├── Identity.sol                  # Main identity smart contract
│   ├── CredentialRegistry.sol        # Verifiable credentials registry
│   ├── CredentialRequest.sol         # Credential request system
│   └── SocialRecovery.sol            # Social recovery contract (NEW!)
│
├── scripts/                          # Deployment & Management Scripts
│   ├── deploy.js                     # Identity contract deployment
│   ├── deploy_credentials.js         # CredentialRegistry deployment
│   ├── deploy_requests.js            # CredentialRequest deployment
│   ├── deploy_recovery.js            # SocialRecovery deployment (NEW!)
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
│   │   │   ├── SetupRecovery.jsx    # Social recovery setup (NEW!)
│   │   │   ├── SocialRecovery.jsx   # Recovery management (NEW!)
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
│   │   │   ├── ipfs.js              # IPFS/Pinata integration service
│   │   │   └── encryption.js        # Client-side encryption (NEW!)
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

The identity contract stores only IPFS hashes on-chain for gas efficiency and supports ownership delegation:

**Key Functions:**
- `createIdentity(string _ipfsHash)` - Creates new identity
- `updateIdentity(string _newIpfsHash)` - Updates existing identity (direct owner only)
- `setOwner(address newOwner)` - Delegates ownership to a recovery contract
- `updateIdentityFor(address user, string _newIpfsHash)` - Allows authorized owner to update (recovery contract)
- `setOwnerFor(address user, address newOwner)` - Allows recovery contract to transfer ownership
- `identities(address)` - View identity data
- `owners(address)` - View current owner/controller

### CredentialRegistry.sol

Manages the lifecycle of W3C Verifiable Credentials:

**Key Functions:**
- `addIssuer(address, string)` - Authorizes new credential issuer (owner only)
- `issueCredential(...)` - Issues verifiable credential to subject (issuer only)
- `revokeCredential(bytes32)` - Revokes credential (issuer or subject)
- `getCredentialStatus(bytes32)` - Returns credential validity status
- `isRegisteredIssuer(address)` - Checks if address is authorized issuer

### CredentialRequest.sol

Facilitates credential requests between users and issuers:

**Key Functions:**
- `createRequest(...)` - User requests credential from issuer
- `approveRequest(uint256)` - Issuer approves request
- `rejectRequest(uint256)` - Issuer rejects request
- `getRequestsByIssuer(address)` - Returns all requests for an issuer

### SocialRecovery.sol (NEW!)

Personal recovery contract for guardian-based account recovery:

**Key Functions:**
- `startRecovery(address _newOwner)` - Guardian initiates recovery
- `supportRecovery()` - Guardian approves active recovery
- `cancelRecovery()` - Current owner cancels recovery attempt
- `executeRecovery()` - Executes recovery after timelock expires
- `updateIdentity(string _newIpfsHash)` - Owner updates identity through recovery contract
- `getGuardians()` - Returns list of authorized guardians
- `hasGuardianApproved(address)` - Checks if guardian has approved active recovery

**State Variables:**
- `guardians` - Array of guardian addresses
- `recoveryThreshold` - Minimum approvals required
- `RECOVERY_TIMELOCK` - 60-second delay before execution
- `activeRecovery` - Current recovery attempt details
- `currentOwner` - Current controller of the identity

### Security Features

**Identity Contract:**
- ✅ One identity per address enforcement
- ✅ Owner-based access control for updates
- ✅ Delegation to recovery contracts
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

**SocialRecovery Contract:**
- ✅ Time-locked execution (60 seconds)
- ✅ Multi-guardian approval requirement
- ✅ Current owner cancel capability
- ✅ Immutable guardian list and threshold
- ✅ Transparent recovery process

## 📦 IPFS Integration

### How It Works

DecentraID uses IPFS (InterPlanetary File System) for decentralized data storage:

1. **Content Addressing**: Each piece of content gets a unique hash (CID)
2. **Immutability**: Content cannot be changed without changing the CID
3. **Decentralization**: No single point of failure
4. **Privacy**: Data encrypted client-side before upload

### Pinata Service

We use Pinata for reliable IPFS pinning:

- **Pinning**: Ensures your data remains available on IPFS
- **Dedicated Gateway**: Fast, reliable access to pinned content
- **API Integration**: Easy uploads via RESTful API
- **File Management**: Track and manage all uploaded files

### Benefits of IPFS Storage

- 📉 **Lower Gas Costs**: Only hash stored on-chain
- 🔒 **Enhanced Privacy**: Full data not visible on blockchain (and now encrypted!)
- 📈 **Scalability**: No blockchain bloat with large data
- 🌐 **Availability**: Distributed across global network
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

## 🚀 Future Enhancements

### Completed Features ✅

1. ✅ **Enhanced Privacy**
   - ✅ Client-side encryption before IPFS upload
   - ✅ Wallet-derived encryption keys
   - ✅ AES-GCM authenticated encryption
   - ⏳ Zero-knowledge proof integration (planned)
   - ⏳ Selective attribute disclosure (planned)

2. ✅ **Social Recovery**
   - ✅ Guardian-based account recovery
   - ✅ Multi-signature approval process
   - ✅ Protection against key loss
   - ✅ Time-locked recovery mechanisms
   - ✅ Personal recovery contract deployment

### Planned Features

#### Phase 1: Advanced Privacy
3. **Zero-Knowledge Proofs**
   - Prove attributes without revealing data
   - Age verification without showing birthdate
   - Credential possession without disclosure

4. **Selective Disclosure**
   - Choose which attributes to share
   - Attribute-level encryption
   - Verifiable selective revelation

#### Phase 2: Enhanced Features
5. **DID Standards Compliance**
   - W3C Decentralized Identifier (DID) specification
   - DID Document management
   - Universal resolver integration
   - Cross-chain DID portability

6. **Reputation System**
   - On-chain reputation scoring
   - Endorsements from other users
   - Skill verification
   - Activity-based reputation

7. **ENS Integration**
   - Link human-readable .eth names
   - Improved user experience
   - Identity resolution via ENS
   - Reverse resolution support

#### Phase 3: Ecosystem Growth
8. **Multi-Chain Deployment**
   - Deploy on Polygon for lower fees
   - Arbitrum and Optimism support
   - Cross-chain identity bridging
   - Chain-agnostic identity management

9. **DAO Governance**
   - Community-driven protocol upgrades
   - Voting mechanisms for features
   - Decentralized decision making
   - Treasury management

10. **Mobile Application**
    - Native iOS and Android apps
    - Biometric authentication
    - QR code identity sharing
    - Push notifications for updates

#### Phase 4: Enterprise Features
11. **Organization Support**
    - Company/organization profiles
    - Employee credential issuance
    - Role-based access control
    - Bulk identity management

12. **API & SDK**
    - RESTful API for integration
    - JavaScript/TypeScript SDK
    - Python library
    - Documentation and examples

13. **Analytics Dashboard**
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

### Security Resources
- [AES-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Social Recovery Best Practices](https://vitalik.ca/general/2021/01/11/recovery.html)
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)

---

**⭐ If you find this project useful, please consider giving it a star!**

**🔗 For detailed information about Verifiable Credentials implementation, see [docs/verifiable-credentials.md](docs/verifiable-credentials.md)**

**🔐 For encryption implementation details, see [client/src/services/encryption.js](client/src/services/encryption.js)**

**🛡️ For social recovery implementation, see [contracts/SocialRecovery.sol](contracts/SocialRecovery.sol)**
