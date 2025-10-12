// client/src/config.js

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "IdentityCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "newIpfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "IdentityUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "createIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "identities",
      "outputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isCreated",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_newIpfsHash",
          "type": "string"
        }
      ],
      "name": "updateIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC;
export const projectId = import.meta.env.VITE_PROJECT_ID;

export const credentialContractAddress = import.meta.env.VITE_CREDENTIAL_REGISTRY_ADDRESS;
export const credentialContractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "credentialId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "subject",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        }
      ],
      "name": "CredentialIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "credentialId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "revoker",
          "type": "address"
        }
      ],
      "name": "CredentialRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "issuerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "IssuerAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "issuerAddress",
          "type": "address"
        }
      ],
      "name": "IssuerRemoved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuerAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addIssuer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "credentialExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "credentials",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "subject",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "issuanceDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expirationDate",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "revoked",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_credentialId",
          "type": "bytes32"
        }
      ],
      "name": "getCredentialStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuerAddress",
          "type": "address"
        }
      ],
      "name": "isRegisteredIssuer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_subject",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expirationDate",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "issueCredential",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "issuers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isIssuer",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuerAddress",
          "type": "address"
        }
      ],
      "name": "removeIssuer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_credentialId",
          "type": "bytes32"
        }
      ],
      "name": "revokeCredential",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

export const credentialRequestAddress = import.meta.env.VITE_CREDENTIAL_REQUEST_ADDRESS;
export const credentialRequestABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_registryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        }
      ],
      "name": "RequestApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "subject",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "schemaName",
          "type": "string"
        }
      ],
      "name": "RequestCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        }
      ],
      "name": "RequestRejected",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        }
      ],
      "name": "approveRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_schemaName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_reason",
          "type": "string"
        }
      ],
      "name": "createRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "credentialRegistry",
      "outputs": [
        {
          "internalType": "contract CredentialRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        }
      ],
      "name": "getRequestsByIssuer",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        }
      ],
      "name": "rejectRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "requests",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "subject",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "schemaName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "internalType": "enum CredentialRequest.RequestStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "requestsByIssuer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
