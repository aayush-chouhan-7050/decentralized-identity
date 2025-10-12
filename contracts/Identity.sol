// contracts/Identity.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Identity {
    struct UserIdentity {
        string ipfsHash;
        bool isCreated;
    }

    mapping(address => UserIdentity) public identities;
    // Maps a user's address to their designated owner/controller
    mapping(address => address) public owners;

    event IdentityCreated(address indexed user);
    event IdentityUpdated(address indexed user);
    event OwnerSet(address indexed user, address indexed newOwner);

    /**
     * @dev Allows anyone to create an identity for their own address.
     */
    function createIdentity(string memory _ipfsHash) public {
        require(!identities[msg.sender].isCreated, "Identity already exists.");
        owners[msg.sender] = msg.sender; // User owns their identity by default
        identities[msg.sender] = UserIdentity(_ipfsHash, true);
        emit IdentityCreated(msg.sender);
    }

    /**
     * @dev A user calls this to update their identity, but only if they are the direct owner.
     */
    function updateIdentity(string memory _newIpfsHash) public {
        require(owners[msg.sender] == msg.sender, "Caller is not the direct owner; use recovery contract.");
        require(identities[msg.sender].isCreated, "Identity does not exist.");
        require(bytes(_newIpfsHash).length > 0, "IPFS hash cannot be empty.");

        identities[msg.sender].ipfsHash = _newIpfsHash;
        emit IdentityUpdated(msg.sender);
    }

    /**
     * @dev A user calls this to delegate ownership to a new contract (e.g., SocialRecovery).
     */
    function setOwner(address newOwner) public {
        require(identities[msg.sender].isCreated, "Identity does not exist.");
        require(owners[msg.sender] == msg.sender, "Only the user can delegate ownership.");
        require(newOwner != address(0), "New owner is zero address.");
        owners[msg.sender] = newOwner;
        emit OwnerSet(msg.sender, newOwner);
    }

    /**
     * @dev Allows an authorized owner (like a recovery contract) to update an identity on behalf of a user.
     */
    function updateIdentityFor(address user, string memory _newIpfsHash) public {
        require(owners[user] == msg.sender, "Caller is not the authorized owner.");
        require(identities[user].isCreated, "Identity does not exist.");
        require(bytes(_newIpfsHash).length > 0, "IPFS hash cannot be empty.");
        identities[user].ipfsHash = _newIpfsHash;
        emit IdentityUpdated(user);
    }

    /**
     * @dev Allows an authorized owner (a recovery contract) to execute a recovery by changing the owner.
     */
    function setOwnerFor(address user, address newOwner) public {
        require(owners[user] == msg.sender, "Caller is not the authorized owner.");
        owners[user] = newOwner;
        emit OwnerSet(user, newOwner);
    }
}