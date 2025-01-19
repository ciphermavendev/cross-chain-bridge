// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenBridge is ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _nonces;

    // Structs
    struct BridgeConfig {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 dailyLimit;
        uint256 fees;
    }

    // State variables
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => bool) public processedTransactions;
    mapping(address => BridgeConfig) public tokenConfigs;
    mapping(address => uint256) public dailyVolume;
    mapping(address => uint256) public lastResetTime;

    // Events
    event TokenLocked(
        address indexed token,
        address indexed sender,
        uint256 amount,
        string destinationChain,
        address destinationAddress,
        bytes32 indexed transactionHash
    );
    
    event TokenUnlocked(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        string sourceChain,
        bytes32 indexed transactionHash
    );
    
    event TokenConfigUpdated(
        address indexed token,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 dailyLimit,
        uint256 fees
    );

    // Constructor
    constructor() {
        // Constructor logic if needed
    }

    // External functions
    function lockTokens(
        address token,
        uint256 amount,
        string calldata destinationChain,
        address destinationAddress
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(destinationChain).length > 0, "Invalid destination chain");
        require(destinationAddress != address(0), "Invalid destination address");

        BridgeConfig memory config = tokenConfigs[token];
        require(amount >= config.minAmount, "Amount below minimum");
        require(amount <= config.maxAmount, "Amount above maximum");

        updateDailyVolume(token, amount);

        // Calculate fees
        uint256 fees = (amount * config.fees) / 10000; // fees in basis points
        uint256 transferAmount = amount - fees;

        // Generate unique transaction hash
        bytes32 transactionHash = generateTransactionHash(
            token,
            msg.sender,
            amount,
            destinationChain,
            destinationAddress
        );

        // Transfer tokens to bridge
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit TokenLocked(
            token,
            msg.sender,
            transferAmount,
            destinationChain,
            destinationAddress,
            transactionHash
        );
    }

    function unlockTokens(
        address token,
        address recipient,
        uint256 amount,
        string calldata sourceChain,
        bytes32 transactionHash
    ) external onlyOwner nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(!processedTransactions[transactionHash], "Transaction processed");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");

        processedTransactions[transactionHash] = true;

        require(
            IERC20(token).transfer(recipient, amount),
            "Transfer failed"
        );

        emit TokenUnlocked(
            token,
            recipient,
            amount,
            sourceChain,
            transactionHash
        );
    }

    // Admin functions
    function addSupportedToken(
        address token,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 dailyLimit,
        uint256 fees
    ) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(!supportedTokens[token], "Token already supported");
        
        supportedTokens[token] = true;
        tokenConfigs[token] = BridgeConfig({
            minAmount: minAmount,
            maxAmount: maxAmount,
            dailyLimit: dailyLimit,
            fees: fees
        });

        emit TokenConfigUpdated(token, minAmount, maxAmount, dailyLimit, fees);
    }

    function updateTokenConfig(
        address token,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 dailyLimit,
        uint256 fees
    ) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        
        tokenConfigs[token] = BridgeConfig({
            minAmount: minAmount,
            maxAmount: maxAmount,
            dailyLimit: dailyLimit,
            fees: fees
        });

        emit TokenConfigUpdated(token, minAmount, maxAmount, dailyLimit, fees);
    }

    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        delete tokenConfigs[token];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal functions
    function generateTransactionHash(
        address token,
        address sender,
        uint256 amount,
        string memory destinationChain,
        address destinationAddress
    ) internal returns (bytes32) {
        _nonces.increment();
        return keccak256(
            abi.encodePacked(
                token,
                sender,
                amount,
                destinationChain,
                destinationAddress,
                _nonces.current(),
                block.timestamp
            )
        );
    }

    function updateDailyVolume(address token, uint256 amount) internal {
        uint256 currentTime = block.timestamp;
        uint256 lastReset = lastResetTime[token];
        
        // Reset daily volume if 24 hours have passed
        if (currentTime - lastReset >= 24 hours) {
            dailyVolume[token] = 0;
            lastResetTime[token] = currentTime;
        }

        uint256 newVolume = dailyVolume[token] + amount;
        require(newVolume <= tokenConfigs[token].dailyLimit, "Daily limit exceeded");
        dailyVolume[token] = newVolume;
    }

    // View functions
    function getTokenConfig(address token) external view returns (BridgeConfig memory) {
        require(supportedTokens[token], "Token not supported");
        return tokenConfigs[token];
    }

    function getDailyVolume(address token) external view returns (uint256) {
        return dailyVolume[token];
    }
}