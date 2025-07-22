# ERC-7806 SDK

A TypeScript SDK for integrating with ERC-7806 smart contract account standard on EVM blockchains. This SDK provides utilities for building EIP-712 typed data, signing with Ethereum wallets, and interacting with StandardRegistry contracts.

## Features

- 🔐 **EIP-712 Typed Data Signing** - Build and sign structured data according to EIP-712 standard
- 🏗️ **StandardRegistry Support** - Complete implementation for StandardRegistry contract permissions
- 📡 **On-chain Integration** - Direct contract interaction with JsonRpcProvider
- 💸 **Gasless Transactions** - Support for signature-based permit functions
- 🎯 **Action Encoding** - Utilities for encoding ETH transfers, ERC20 transfers, and general contract calls
- 🔄 **Relay Execution** - Support for building and signing relay execution intents
- 🔧 **TypeScript Support** - Full TypeScript support with comprehensive type definitions
- 🌐 **EVM Compatible** - Works with any EVM-compatible blockchain

## Installation

```bash
npm install erc-7806-sdk
# or
yarn add erc-7806-sdk
```

## Quick Start

### Basic EIP-712 Signing

```javascript
import { ethers } from 'ethers';
import { signStandardRegistryPermission } from 'erc-7806-sdk';

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR-PROJECT-ID');
const signer = new ethers.Wallet(privateKey, provider);

// Sign a permission
const [signature, signerAddress] = await signStandardRegistryPermission(
  signer,
  '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8', // StandardRegistry contract
  11155111, // Sepolia testnet
  true,     // registering = true
  '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39', // standard contract
  Date.now() // nonce
);
```

### Action Encoding

```javascript
import { encodeAction, Action } from 'erc-7806-sdk';

// ETH Transfer Action
const ethAction: Action = {
  type: 'TRANSFER_ETH',
  receiver: '0x...',
  amount: '1000000000000000000' // 1 ETH
};

// ERC20 Transfer Action
const erc20Action: Action = {
  type: 'TRANSFER_ERC20',
  receiver: '0x...',
  amount: '1000000',
  tokenAddress: '0x...'
};

// General Execution Action
const generalAction: Action = {
  type: 'GENERAL_EXECUTION',
  targetAddress: '0x...',
  amount: '0',
  calldata: '0x...'
};

// Encode actions
const encodedEthTransfer = encodeAction(ethAction);
const encodedErc20Transfer = encodeAction(erc20Action);
const encodedExecution = encodeAction(generalAction);
```

### Relay Execution

```javascript
import { RelayExecution } from 'erc-7806-sdk';

const relayExecution = new RelayExecution(relayExecutionAddress, chainId);

// Build a relay execution intent
const intent = await relayExecution.buildIntent(
  paymentTokenAddress,
  paymentTokenAmount,
  [ethAction, erc20Action], // Array of actions to execute
  60, // expiration in minutes
  signer,
  relayerAddress // optional
);
```

### Contract Interactions

```javascript
import { 
  isStandardRegistered, 
  registerStandard, 
  signAndPermitStandardRegistration 
} from 'erc-7806-sdk';

// Check if a standard is registered
const status = await isStandardRegistered(
  provider,
  registryAddress,
  signerAddress,
  standardAddress
);

// Register directly (requires gas)
const result = await registerStandard(
  signer,
  registryAddress,
  standardAddress,
  Date.now()
);
```

### SDK Class Usage

```javascript
import { StandardRegistry } from 'erc-7806-sdk';

const registry = new StandardRegistry(registryAddress, chainId);

// Check registration status
const status = await registry.isStandardRegistered(provider, signerAddress, standardAddress);

// Register standard
const result = await registry.registerStandard(signer, standardAddress, Date.now());
```

## API Reference

### Core Functions

#### `signStandardRegistryPermission(signer, contractAddress, chainId, registering, standard, nonce)`
Sign StandardRegistry permission using an ethers.js signer. Returns `[signature, signerAddress]`.

#### `getStandardRegistryTypedDataHash(contractAddress, chainId, registering, standard, nonce)`
Generate unsigned typed data hash for StandardRegistry permissions.

#### `recoverStandardRegistrySigner(contractAddress, chainId, registering, standard, nonce, signature)`
Recover signer address from a StandardRegistry signature.

### Action Encoding Functions

#### `encodeAction(action: Action)`
Encode any type of action based on its type.

#### `encodeTransferEth(action: Action)`
Encode an ETH transfer action.

#### `encodeTransferErc20(action: Action)`
Encode an ERC20 token transfer action.

#### `encodeGeneralExecution(action: Action)`
Encode a general contract execution action.

### Contract Helper Functions

#### `isStandardRegistered(provider, registryAddress, signerAddress, standardAddress)`
Check if a standard is registered for a specific signer on-chain.

#### `registerStandard(signer, registryAddress, standardAddress, nonce?)`
Register a standard using a direct transaction.

#### `unregisterStandard(signer, registryAddress, standardAddress, nonce?)`
Unregister a standard using a direct transaction.

#### `permitStandardRegistration(signer, registryAddress, signerAddress, standardAddress, registering, nonce, signature)`
Register/unregister a standard using a signature (gasless).

#### `getStandardRegistryContract(registryAddress, signerOrProvider)`
Get a contract instance for direct interaction with StandardRegistry.

## Examples

See the [example directory](./example/) for complete working examples:
- [Basic Usage](./example/index.js) - EIP-712 signing and signature recovery
- [Contract Interactions](./example/contractExample.js) - On-chain contract operations

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Resources

- [ERC-7806 Specification](https://eips.ethereum.org/EIPS/eip-7806)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
