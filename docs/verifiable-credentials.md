# 🪪 Verifiable Credentials (VCs) in DecentraID

This document outlines the integration of the **W3C Verifiable Credentials** standard into the **DecentraID** platform.  
This feature significantly enhances the system by allowing trusted third parties to issue **tamper-proof, verifiable digital attestations** (like degrees, certificates, or licenses) to users.

---

## 1. What are Verifiable Credentials?

A **Verifiable Credential (VC)** is a digital equivalent of a physical credential, but with the added benefits of **cryptographic security** and **verifiability**.  
The system operates on a **“triangle of trust”** model:

- **Issuer** → An entity (e.g., a university, government, or employer) that creates a credential and issues it to a subject.  
- **Holder (Subject)** → The user who receives the credential and stores it. In our case, this is the DecentraID user.  
- **Verifier** → An entity that needs to verify the authenticity of a credential presented by the holder.

By storing the status of these credentials on the blockchain, we create a **decentralized and trustworthy system** for verification — without relying on the issuer to be available at all times.

---

## 2. Implementation in DecentraID

We integrated VCs by creating a dedicated **smart contract** to manage their lifecycle and building the necessary **frontend components** for interaction.

### 🧱 System Architecture

- **Smart Contract (`CredentialRegistry.sol`)**  
  Deployed on the **Sepolia testnet**, this contract acts as the root of trust.  
  It manages a list of approved issuers and serves as a public registry for credential statuses (i.e., whether a credential has been issued or revoked).

- **IPFS for Data Storage**  
  The actual content of the Verifiable Credential (a JSON object) is stored on **IPFS**.  
  This keeps sensitive data **off-chain**, reducing costs and enhancing privacy.  
  The smart contract only stores the **IPFS hash (CID)** of this data.

- **Frontend Interface**
  - An administrative script (`add_issuer.js`) allows the contract owner to authorize new issuers.
  - A dedicated UI (`IssueCredential.jsx`) allows authorized issuers to create and issue new credentials to users.
  - The user's profile page (`ProfileViewer.jsx`) displays any credentials they hold, showing their **status** (Active, Revoked, Expired).

---

### 🔄 Data Flow for Issuing a Credential

1. An authorized **Issuer** connects their wallet and navigates to the "Issue Credential" form.  
2. The issuer fills in the recipient’s wallet address (subject) and the details of the credential (e.g., "Bachelor of Engineering").  
3. Upon submission, the frontend constructs a **W3C-compliant JSON object** for the credential.  
4. This JSON object is uploaded to **IPFS** via the **Pinata** service, which returns a unique IPFS hash (CID).  
5. The frontend then calls the **`issueCredential`** function on the smart contract, passing the subject’s address, credential details, and IPFS hash.  
6. The smart contract verifies that the caller is an **authorized issuer**, records the credential’s metadata on-chain, and emits a **CredentialIssued** event.  
7. The **recipient (Holder)** can now see the newly issued credential on their DecentraID profile page.

---

## 3. ⚙️ Smart Contract Details (`CredentialRegistry.sol`)

The `CredentialRegistry.sol` contract is the backbone of our VC system.

### Key Functions

- `addIssuer(address _issuerAddress, string memory _name)`  
  Adds and approves a new entity as a credential issuer (owner-only).

- `issueCredential(...)`  
  Restricted to approved issuers. Creates a unique credential ID, stores details (including the IPFS hash) on-chain, and links it to the subject’s address.

- `revokeCredential(bytes32 _credentialId)`  
  Allows either the issuer or the subject of a credential to revoke it.

- `getCredentialStatus(bytes32 _credentialId)`  
  A public view function that returns whether a credential is **valid, revoked, or expired**.

This design ensures that while the **credential data itself remains off-chain**, its **authenticity and status** are always verifiable through the **immutable public ledger**.

---