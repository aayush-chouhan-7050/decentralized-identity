// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Identity
 * @dev A smart contract for creating and managing a basic decentralized identity.
 */
contract Identity {

    // 1. DATA STRUCTURE
    struct UserIdentity {
        string name;
        string email;
        bool isCreated;
    }

    // 2. STATE VARIABLE (STORAGE)
    mapping(address => UserIdentity) public identities;

    // 3. EVENT
    event IdentityCreated(address indexed user, string name, uint256 timestamp);

    // 4. FUNCTION
    function createIdentity(string memory _name, string memory _email) public {
        require(!identities[msg.sender].isCreated, "Identity already exists for this address.");

        require(bytes(_name).length > 0, "Name cannot be empty.");

        identities[msg.sender] = UserIdentity({
            name: _name,
            email: _email,
            isCreated: true
        });

        emit IdentityCreated(msg.sender, _name, block.timestamp);
    }
}