// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CredentialRegistry
 * @dev Manages the lifecycle of Verifiable Credentials, including issuers,
 * credential schemas, and revocation.
 */
contract CredentialRegistry {
    address public owner;

    struct Issuer {
        bool isIssuer;
        string name;
    }

    struct Credential {
        bytes32 schemaId;
        address subject;
        address issuer;
        uint256 issuanceDate;
        uint256 expirationDate;
        bool revoked;
        string ipfsHash;
    }

    mapping(address => Issuer) public issuers;
    mapping(bytes32 => Credential) public credentials;
    mapping(bytes32 => bool) public credentialExists;

    event IssuerAdded(address indexed issuerAddress, string name);
    event IssuerRemoved(address indexed issuerAddress);
    event CredentialIssued(bytes32 indexed credentialId, bytes32 indexed schemaId, address indexed subject, address issuer);
    event CredentialRevoked(bytes32 indexed credentialId, address indexed revoker);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyIssuer() {
        require(issuers[msg.sender].isIssuer, "Caller is not a registered issuer.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addIssuer(address _issuerAddress, string memory _name) public onlyOwner {
        require(!issuers[_issuerAddress].isIssuer, "Issuer already exists.");
        issuers[_issuerAddress] = Issuer({
            isIssuer: true,
            name: _name
        });
        emit IssuerAdded(_issuerAddress, _name);
    }

    function removeIssuer(address _issuerAddress) public onlyOwner {
        require(issuers[_issuerAddress].isIssuer, "Issuer does not exist.");
        delete issuers[_issuerAddress];
        emit IssuerRemoved(_issuerAddress);
    }

    function issueCredential(
        address _subject,
        bytes32 _schemaId,
        uint256 _expirationDate,
        string memory _ipfsHash
    ) public onlyIssuer returns (bytes32) {
        bytes32 credentialId = keccak256(abi.encodePacked(_subject, _schemaId, msg.sender, block.timestamp));
        require(!credentialExists[credentialId], "Credential already issued.");

        credentials[credentialId] = Credential({
            schemaId: _schemaId,
            subject: _subject,
            issuer: msg.sender,
            issuanceDate: block.timestamp,
            expirationDate: _expirationDate,
            revoked: false,
            ipfsHash: _ipfsHash
        });
        credentialExists[credentialId] = true;

        emit CredentialIssued(credentialId, _schemaId, _subject, msg.sender);
        return credentialId;
    }

    function revokeCredential(bytes32 _credentialId) public {
        require(credentialExists[_credentialId], "Credential does not exist.");
        Credential storage cred = credentials[_credentialId];
        require(msg.sender == cred.issuer || msg.sender == cred.subject, "Only issuer or subject can revoke.");
        require(!cred.revoked, "Credential already revoked.");

        cred.revoked = true;
        emit CredentialRevoked(_credentialId, msg.sender);
    }

    /**
     * @dev Checks if an address is a registered issuer.
     * @param _issuerAddress The address to check.
     * @return bool True if the address is an issuer, false otherwise.
     */
    function isRegisteredIssuer(address _issuerAddress) public view returns (bool) {
        return issuers[_issuerAddress].isIssuer;
    }

    function getCredentialStatus(bytes32 _credentialId) public view returns (bool, bool) {
        if (!credentialExists[_credentialId]) {
            return (false, false);
        }
        Credential memory cred = credentials[_credentialId];
        bool isExpired = (cred.expirationDate != 0 && cred.expirationDate < block.timestamp);
        return (cred.revoked, isExpired);
    }
}