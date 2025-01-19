# Cross-Chain Token Bridge DApp

A secure, efficient, and decentralized cross-chain token bridge implementation supporting Ethereum, BSC, and Polygon networks. This bridge enables seamless ERC20 token transfers between different blockchain networks with multi-validator security and configurable parameters.

## Key Features

- **Multi-Chain Support**: 
  - Ethereum (Mainnet & Goerli)
  - BSC (Mainnet & Testnet)
  - Polygon (Mainnet & Mumbai)

- **Security Features**:
  - Multi-validator consensus mechanism
  - Reentrancy protection
  - Pausable functionality
  - Daily limits and volume tracking
  - Comprehensive security checks

- **Smart Contract Features**:
  - ERC20 token support
  - Configurable fees and limits
  - Transaction verification
  - Automated nonce management

- **Development Features**:
  - Complete test coverage
  - Automated deployments
  - Gas optimizations
  - Comprehensive documentation

## Tech Stack

- Solidity ^0.8.0
- Hardhat
- OpenZeppelin Contracts
- Ethers.js
- Waffle/Chai Testing
- TypeScript/JavaScript

## Quick Start

### Prerequisites

```bash
node >= 14.0.0
npm >= 6.14.0
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cross-chain-bridge.git
cd cross-chain-bridge
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

1. Update network configurations in `config/networks.js`:
```javascript
module.exports = {
  ethereum: {
    // Ethereum network config
  },
  bsc: {
    // BSC network config
  },
  // ... other networks
}
```

2. Configure tokens in `config/constants.js`:
```javascript
const TOKEN_CONFIG = {
  // Token configurations
}
```

### Testing

```bash
# Run all tests
npm test

# Run specific test
npx hardhat test test/TokenBridge.test.js

# Get coverage report
npm run coverage
```

### Deployment

1. Setup your deployment network in `hardhat.config.js`
2. Deploy contracts:

```bash
# Mainnet deployments
npm run deploy:ethereum
npm run deploy:bsc
npm run deploy:polygon

# Testnet deployments
npm run deploy:goerli
npm run deploy:testnet
npm run deploy:mumbai
```

## Smart Contract Architecture

### Core Contracts

1. **TokenBridge.sol**
   - Main bridge contract
   - Handles token locking/unlocking
   - Manages token configurations
   - Implements security features

2. **BridgeValidator.sol**
   - Manages validator consensus
   - Handles transaction validation
   - Controls validator permissions

### Key Functions

```solidity
// Lock tokens on source chain
function lockTokens(
    address token,
    uint256 amount,
    string calldata destinationChain,
    address destinationAddress
) external;

// Unlock tokens on destination chain
function unlockTokens(
    address token,
    address recipient,
    uint256 amount,
    string calldata sourceChain,
    bytes32 transactionHash
) external;
```

## Security Measures

1. **Multi-Validator Architecture**
   - Required validator consensus
   - Configurable threshold

2. **Transaction Security**
   - Reentrancy protection
   - Transaction verification
   - Nonce management

3. **Operational Security**
   - Daily limits
   - Amount restrictions
   - Pausable operations

## Monitoring & Maintenance

1. Monitor daily volumes:
```javascript
const volume = await bridge.getDailyVolume(tokenAddress);
```

2. Check token configuration:
```javascript
const config = await bridge.getTokenConfig(tokenAddress);
```

3. View bridge status:
```javascript
const isActive = !await bridge.paused();
```

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```

4. Push to the branch:
```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.