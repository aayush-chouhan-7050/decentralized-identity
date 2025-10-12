// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./CredentialRegistry.sol";

/**
 * @title CredentialRequest
 * @dev Manages user requests for verifiable credentials from registered issuers.
 */
contract CredentialRequest {
    enum RequestStatus { Pending, Approved, Rejected }

    struct Request {
        uint256 id;
        address subject;
        address issuer;  
        string schemaName; 
        string reason;
        RequestStatus status;
    }

    CredentialRegistry public credentialRegistry;
    uint256 private _nextRequestId;
    mapping(uint256 => Request) public requests;
    mapping(address => uint256[]) public requestsByIssuer;

    event RequestCreated(uint256 indexed requestId, address indexed subject, address indexed issuer, string schemaName);
    event RequestApproved(uint256 indexed requestId, address indexed issuer);
    event RequestRejected(uint256 indexed requestId, address indexed issuer);

    constructor(address _registryAddress) {
        credentialRegistry = CredentialRegistry(_registryAddress);
    }

    function createRequest(address _issuer, string memory _schemaName, string memory _reason) public {
        require(credentialRegistry.isRegisteredIssuer(_issuer), "Requested address is not a registered issuer.");
        
        uint256 requestId = _nextRequestId++;
        requests[requestId] = Request({
            id: requestId,
            subject: msg.sender,
            issuer: _issuer,
            schemaName: _schemaName,
            reason: _reason,
            status: RequestStatus.Pending
        });

        requestsByIssuer[_issuer].push(requestId);
        emit RequestCreated(requestId, msg.sender, _issuer, _schemaName);
    }

    function approveRequest(uint256 _requestId) public {
        Request storage req = requests[_requestId];
        require(req.issuer == msg.sender, "Only the designated issuer can approve this request.");
        require(req.status == RequestStatus.Pending, "Request is not pending.");

        req.status = RequestStatus.Approved;
        emit RequestApproved(_requestId, msg.sender);
    }

    function rejectRequest(uint256 _requestId) public {
        Request storage req = requests[_requestId];
        require(req.issuer == msg.sender, "Only the designated issuer can reject this request.");
        require(req.status == RequestStatus.Pending, "Request is not pending.");

        req.status = RequestStatus.Rejected;
        emit RequestRejected(_requestId, msg.sender);
    }

    function getRequestsByIssuer(address _issuer) public view returns (uint256[] memory) {
        return requestsByIssuer[_issuer];
    }
}