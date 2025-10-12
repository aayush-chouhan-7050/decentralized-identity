// contracts/SocialRecovery.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Identity.sol";

contract SocialRecovery {
    Identity public immutable identityContract;
    address public immutable originalUser;
    address public currentOwner;

    mapping(address => bool) public isGuardian;
    address[] public guardians;
    uint256 public recoveryThreshold;

    struct RecoveryAttempt {
        address newOwner;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        uint256 executionTime;
    }
    RecoveryAttempt public activeRecovery;
    uint256 public constant RECOVERY_TIMELOCK = 60 seconds;

    event RecoveryExecuted(address indexed oldOwner, address indexed newOwner);
    
    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "Not a guardian.");
        _;
    }

    modifier onlyCurrentOwner() {
        require(msg.sender == currentOwner, "Only current owner can call this.");
        _;
    }

    constructor(address _identityContract, address[] memory _initialGuardians, uint256 _threshold) {
        identityContract = Identity(_identityContract);
        originalUser = msg.sender;
        currentOwner = msg.sender;
        recoveryThreshold = _threshold;

        for (uint i = 0; i < _initialGuardians.length; i++) {
            isGuardian[_initialGuardians[i]] = true;
            guardians.push(_initialGuardians[i]);
        }
    }
    
    function hasGuardianApproved(address _guardian) public view returns (bool) {
        if (activeRecovery.newOwner == address(0)) {
            return false;
        }
        return activeRecovery.approvals[_guardian];
    }
    
    function getGuardians() public view returns (address[] memory) {
        return guardians;
    }

    function updateIdentity(string memory _newIpfsHash) public onlyCurrentOwner {
        identityContract.updateIdentityFor(originalUser, _newIpfsHash);
    }

    function startRecovery(address _newOwner) public onlyGuardian {
        require(activeRecovery.newOwner == address(0), "Recovery already in progress.");
        activeRecovery.newOwner = _newOwner;
        activeRecovery.approvals[msg.sender] = true;
        activeRecovery.approvalCount = 1;
        if (activeRecovery.approvalCount >= recoveryThreshold) {
            activeRecovery.executionTime = block.timestamp + RECOVERY_TIMELOCK;
        }
    }

    function supportRecovery() public onlyGuardian {
        require(activeRecovery.newOwner != address(0), "No recovery in progress.");
        require(!activeRecovery.approvals[msg.sender], "Already approved.");
        activeRecovery.approvals[msg.sender] = true;
        activeRecovery.approvalCount++;
        if (activeRecovery.approvalCount >= recoveryThreshold) {
            activeRecovery.executionTime = block.timestamp + RECOVERY_TIMELOCK;
        }
    }
    
    function cancelRecovery() public onlyCurrentOwner {
        delete activeRecovery;
    }

    function executeRecovery() public {
        require(activeRecovery.newOwner != address(0), "No recovery in progress.");
        require(activeRecovery.approvalCount >= recoveryThreshold, "Threshold not met.");
        require(block.timestamp >= activeRecovery.executionTime, "Timelock not expired.");

        address oldOwner = currentOwner;
        address newRecoveryContractOwner = activeRecovery.newOwner;

        identityContract.setOwnerFor(originalUser, newRecoveryContractOwner);
        currentOwner = newRecoveryContractOwner;
        
        emit RecoveryExecuted(oldOwner, newRecoveryContractOwner);
        delete activeRecovery;
    }
}