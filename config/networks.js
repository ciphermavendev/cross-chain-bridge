const networks = {
    ethereum: {
        name: "Ethereum",
        chainId: 1,
        rpc: process.env.ETHEREUM_RPC_URL,
        symbol: "ETH",
        explorer: "https://etherscan.io",
        confirmations: 12,
        gasMultiplier: 1.2,
        contracts: {
            bridge: process.env.ETH_BRIDGE_ADDRESS,
            validator: process.env.ETH_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.ETHERSCAN_API_KEY,
            browser: "https://etherscan.io/address"
        }
    },
    bsc: {
        name: "Binance Smart Chain",
        chainId: 56,
        rpc: process.env.BSC_RPC_URL,
        symbol: "BNB",
        explorer: "https://bscscan.com",
        confirmations: 15,
        gasMultiplier: 1.1,
        contracts: {
            bridge: process.env.BSC_BRIDGE_ADDRESS,
            validator: process.env.BSC_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.BSCSCAN_API_KEY,
            browser: "https://bscscan.com/address"
        }
    },
    polygon: {
        name: "Polygon",
        chainId: 137,
        rpc: process.env.POLYGON_RPC_URL,
        symbol: "MATIC",
        explorer: "https://polygonscan.com",
        confirmations: 256,
        gasMultiplier: 1.3,
        contracts: {
            bridge: process.env.POLYGON_BRIDGE_ADDRESS,
            validator: process.env.POLYGON_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.POLYGONSCAN_API_KEY,
            browser: "https://polygonscan.com/address"
        }
    },
    // Testnets
    goerli: {
        name: "Goerli",
        chainId: 5,
        rpc: process.env.GOERLI_RPC_URL,
        symbol: "ETH",
        explorer: "https://goerli.etherscan.io",
        confirmations: 6,
        gasMultiplier: 1.2,
        contracts: {
            bridge: process.env.GOERLI_BRIDGE_ADDRESS,
            validator: process.env.GOERLI_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.ETHERSCAN_API_KEY,
            browser: "https://goerli.etherscan.io/address"
        }
    },
    bscTestnet: {
        name: "BSC Testnet",
        chainId: 97,
        rpc: process.env.BSC_TESTNET_RPC_URL,
        symbol: "tBNB",
        explorer: "https://testnet.bscscan.com",
        confirmations: 6,
        gasMultiplier: 1.1,
        contracts: {
            bridge: process.env.BSC_TESTNET_BRIDGE_ADDRESS,
            validator: process.env.BSC_TESTNET_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.BSCSCAN_API_KEY,
            browser: "https://testnet.bscscan.com/address"
        }
    },
    mumbai: {
        name: "Mumbai",
        chainId: 80001,
        rpc: process.env.MUMBAI_RPC_URL,
        symbol: "MATIC",
        explorer: "https://mumbai.polygonscan.com",
        confirmations: 6,
        gasMultiplier: 1.3,
        contracts: {
            bridge: process.env.MUMBAI_BRIDGE_ADDRESS,
            validator: process.env.MUMBAI_VALIDATOR_ADDRESS
        },
        verification: {
            apiKey: process.env.POLYGONSCAN_API_KEY,
            browser: "https://mumbai.polygonscan.com/address"
        }
    }
};

// Utility functions
const getNetwork = (chainId) => {
    return Object.values(networks).find(network => network.chainId === chainId);
};

const isNetworkSupported = (chainId) => {
    return !!getNetwork(chainId);
};

const getContractAddress = (chainId, contractType) => {
    const network = getNetwork(chainId);
    return network?.contracts[contractType];
};

const getExplorerUrl = (chainId, address) => {
    const network = getNetwork(chainId);
    return `${network?.verification.browser}/${address}`;
};

module.exports = {
    networks,
    getNetwork,
    isNetworkSupported,
    getContractAddress,
    getExplorerUrl
};