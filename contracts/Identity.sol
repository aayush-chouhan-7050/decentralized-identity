// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Identity
 * @dev Manages decentralized identities by storing a pointer (IPFS hash)
 * to off-chain profile data.
 */
contract Identity {

    // The struct is now simpler, only storing the IPFS hash.
    struct UserIdentity {
        string ipfsHash; // A Content Identifier (CID) from IPFS
        bool isCreated;
    }

    mapping(address => UserIdentity) public identities;

    event IdentityCreated(address indexed user, string ipfsHash, uint256 timestamp);
    event IdentityUpdated(address indexed user, string newIpfsHash, uint256 timestamp);

    /**
     * @dev Creates an identity by storing an IPFS hash.
     * @param _ipfsHash The hash of the JSON profile data stored on IPFS.
     */
    function createIdentity(string memory _ipfsHash) public {
        require(!identities[msg.sender].isCreated, "Identity already exists for this address.");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty.");

        identities[msg.sender] = UserIdentity({
            ipfsHash: _ipfsHash,
            isCreated: true
        });

        emit IdentityCreated(msg.sender, _ipfsHash, block.timestamp);
    }

    /**
     * @dev Updates the IPFS hash for an existing identity.
     * @param _newIpfsHash The new hash of the updated JSON profile data.
     */
    function updateIdentity(string memory _newIpfsHash) public {
        require(identities[msg.sender].isCreated, "No identity found for this address to update.");
        require(bytes(_newIpfsHash).length > 0, "New IPFS hash cannot be empty.");

        identities[msg.sender].ipfsHash = _newIpfsHash;

        emit IdentityUpdated(msg.sender, _newIpfsHash, block.timestamp);
    }
}