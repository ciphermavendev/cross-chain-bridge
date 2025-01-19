// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBridgeValidator.sol";

contract BridgeValidator is IBridgeValidator, Ownable {
    // Mapping of validators
    mapping(address => bool) private validators;
    
    // Number of validators required for confirmation
    uint256 public validationThreshold;
    
    // Mapping of transaction hash to validator confirmations
    mapping(bytes32 => mapping(address => bool)) private validatorConfirmations;
    
    // Mapping of transaction hash to confirmation count
    mapping(bytes32 => uint256) private confirmationCount;

    constructor(uint256 _threshold) {
        require(_threshold > 0, "Invalid threshold");
        validationThreshold = _threshold;
        validators[msg.sender] = true;
        emit ValidatorAdded(msg.sender);
    }

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

    function validateTransaction(
        bytes32 transactionHash,
        address token,
        address recipient,
        uint256 amount,
        string calldata sourceChain
    ) external override onlyValidator returns (bool) {
        require(!validatorConfirmations[transactionHash][msg.sender], "Already validated");
        
        // Record validation
        validatorConfirmations[transactionHash][msg.sender] = true;
        confirmationCount[transactionHash]++;
        
        // Check if threshold is met
        return confirmationCount[transactionHash] >= validationThreshold;
    }

    function addValidator(address validator) external override onlyOwner {
        require(validator != address(0), "Invalid validator address");
        require(!validators[validator], "Already a validator");
        
        validators[validator] = true;
        emit ValidatorAdded(validator);
    }

    function removeValidator(address validator) external override onlyOwner {
        require(validators[validator], "Not a validator");
        
        validators[validator] = false;
        emit ValidatorRemoved(validator);
    }

    function setThreshold(uint256 newThreshold) external override onlyOwner {
        require(newThreshold > 0, "Invalid threshold");
        validationThreshold = newThreshold;
        emit ThresholdUpdated(newThreshold);
    }

    function isValidator(address account) external view override returns (bool) {
        return validators[account];
    }
}