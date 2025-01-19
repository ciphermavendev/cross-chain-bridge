// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBridgeValidator {
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event ThresholdUpdated(uint256 newThreshold);
    
    function validateTransaction(
        bytes32 transactionHash,
        address token,
        address recipient,
        uint256 amount,
        string calldata sourceChain
    ) external returns (bool);
    
    function addValidator(address validator) external;
    function removeValidator(address validator) external;
    function setThreshold(uint256 newThreshold) external;
    function isValidator(address account) external view returns (bool);
}