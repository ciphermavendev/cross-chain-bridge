// Bridge Configuration
const BRIDGE_CONFIG = {
    // Default token configuration (in basis points, 1 = 0.01%)
    DEFAULT_FEE_RATE: 30, // 0.3%
    MIN_FEE_RATE: 10,    // 0.1%
    MAX_FEE_RATE: 500,   // 5%

    // Time configurations
    PROCESSING_TIME: 600,         // 10 minutes in seconds
    MAX_PROCESSING_TIME: 3600,    // 1 hour in seconds
    DAILY_RESET_INTERVAL: 86400,  // 24 hours in seconds

    // Validation configurations
    DEFAULT_VALIDATORS_THRESHOLD: 2,
    MIN_VALIDATORS: 1,
    MAX_VALIDATORS: 10,

    // Transaction limits
    DEFAULT_MIN_TRANSFER: "0.01",
    DEFAULT_MAX_TRANSFER: "100000",
    DEFAULT_DAILY_LIMIT: "1000000",

    // Gas configurations
    GAS_LIMIT: {
        LOCK: 200000,
        UNLOCK: 150000,
        ADD_TOKEN: 100000,
        REMOVE_TOKEN: 80000,
        ADD_VALIDATOR: 60000
    },

    // Status codes
    STATUS: {
        PENDING: 0,
        PROCESSING: 1,
        COMPLETED: 2,
        FAILED: 3,
        CANCELLED: 4
    }
};

// Supported token configurations
const TOKEN_CONFIG = {
    // Example token configurations
    USDT: {
        ethereum: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        bsc: "0x55d398326f99059ff775485246999027b3197955",
        polygon: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        decimals: 6,
        minTransfer: "1",      // 1 USDT
        maxTransfer: "100000", // 100,000 USDT
        dailyLimit: "1000000"  // 1,000,000 USDT
    },
    USDC: {
        ethereum: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        bsc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        polygon: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        decimals: 6,
        minTransfer: "1",
        maxTransfer: "100000",
        dailyLimit: "1000000"
    }
};

// Error messages
const ERRORS = {
    GENERAL: {
        UNAUTHORIZED: "Unauthorized access",
        INVALID_ADDRESS: "Invalid address provided",
        INVALID_AMOUNT: "Invalid amount provided",
        PAUSED: "Contract is paused"
    },
    BRIDGE: {
        TOKEN_NOT_SUPPORTED: "Token not supported",
        INSUFFICIENT_BALANCE: "Insufficient balance",
        DAILY_LIMIT_EXCEEDED: "Daily limit exceeded",
        AMOUNT_TOO_LOW: "Amount below minimum",
        AMOUNT_TOO_HIGH: "Amount above maximum",
        ALREADY_PROCESSED: "Transaction already processed",
        INVALID_DESTINATION: "Invalid destination chain",
        INVALID_SOURCE: "Invalid source chain"
    },
    VALIDATOR: {
        ALREADY_VALIDATED: "Already validated",
        INSUFFICIENT_VALIDATORS: "Insufficient validators",
        INVALID_SIGNATURE: "Invalid signature",
        INVALID_THRESHOLD: "Invalid threshold value"
    }
};

// Events
const EVENTS = {
    BRIDGE: {
        TOKEN_LOCKED: "TokenLocked",
        TOKEN_UNLOCKED: "TokenUnlocked",
        TOKEN_ADDED: "TokenAdded",
        TOKEN_REMOVED: "TokenRemoved",
        DAILY_LIMIT_UPDATED: "DailyLimitUpdated",
        FEES_UPDATED: "FeesUpdated"
    },
    VALIDATOR: {
        VALIDATOR_ADDED: "ValidatorAdded",
        VALIDATOR_REMOVED: "ValidatorRemoved",
        THRESHOLD_UPDATED: "ThresholdUpdated",
        TRANSACTION_VALIDATED: "TransactionValidated"
    }
};

module.exports = {
    BRIDGE_CONFIG,
    TOKEN_CONFIG,
    ERRORS,
    EVENTS
};