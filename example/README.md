# ERC-7806 SDK Example

This directory contains a working example of how to use the ERC-7806 SDK to interact with StandardRegistry contracts on the Ethereum Sepolia testnet.

## Overview

The example demonstrates:
- ✅ Connecting to Sepolia testnet using a public RPC
- ✅ Checking standard registration status
- ✅ Using the StandardRegistrySDK class
- ✅ Direct contract interaction
- ✅ EIP-712 signature generation and verification
- ✅ Transaction preparation for registration/unregistration

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the example:**
   ```bash
   npm run contract-example
   ```

The script will connect to Sepolia testnet and demonstrate various SDK features without requiring any setup or private keys.

## What the Example Does

### 1. Network Connection
- Connects to Sepolia testnet using `https://eth-sepolia.public.blastapi.io`
- Verifies the connection and displays network information

### 2. Registration Status Check
- Checks if a standard is registered for a specific signer
- Demonstrates both direct function calls and SDK class usage

### 3. EIP-712 Signature Generation
- Creates EIP-712 signatures for gasless transactions
- Verifies signatures by recovering the signer address
- Uses a demo private key (safe for testing)

### 4. Transaction Examples
- Shows how to prepare registration transactions
- Demonstrates gasless registration using signatures
- Provides code templates for real usage

## Configuration

The example uses these default addresses on Sepolia:

```javascript
const config = {
  registryAddress: '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8', // StandardRegistry contract
  chainId: 11155111, // Sepolia testnet
  rpcUrl: 'https://eth-sepolia.public.blastapi.io', // Public RPC
  standardAddress: '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39', // Example standard
  signerAddress: '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13', // Example signer
};
```

## Real Usage

To use the SDK in your own project:

### 1. Install the SDK
```bash
npm install erc-7806-sdk ethers
```

### 2. Basic Usage
```javascript
const { ethers } = require('ethers');
const { StandardRegistrySDK, isStandardRegistered } = require('erc-7806-sdk');

// Create provider
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');

// Check registration status
const status = await isStandardRegistered(
  provider,
  'REGISTRY_ADDRESS',
  'SIGNER_ADDRESS',
  'STANDARD_ADDRESS'
);

console.log('Is registered:', status.isRegistered);
```

### 3. Using the SDK Class
```javascript
const sdk = new StandardRegistrySDK('REGISTRY_ADDRESS', 11155111);

// Check registration
const status = await sdk.isStandardRegistered(provider, signerAddress, standardAddress);

// Generate signature for gasless registration
const [signature, signerAddr] = await sdk.signPermission(
  signer,
  true, // registering
  standardAddress,
  nonce
);
```

### 4. Execute Transactions
```javascript
const { registerStandard } = require('erc-7806-sdk');

// Direct registration (requires gas)
const signer = new ethers.Wallet(privateKey, provider);
const result = await registerStandard(
  signer,
  registryAddress,
  standardAddress,
  nonce
);

if (result.success) {
  console.log('Transaction hash:', result.transactionHash);
}
```

## Security Notes

⚠️ **Important Security Information:**

1. **Private Keys**: The example uses a demo private key for signature generation. Never use this key in production or with real funds.

2. **Real Usage**: When using the SDK in production:
   - Use your own private key securely
   - Ensure your wallet has sufficient ETH for gas fees
   - Test on testnets before mainnet deployment

3. **RPC Endpoints**: The example uses a public RPC endpoint. For production, consider using:
   - Your own node
   - Premium RPC services (Infura, Alchemy, etc.)
   - Rate-limited endpoints may affect performance

## Available Scripts

- `npm start` - Run the basic example
- `npm run contract-example` - Run the comprehensive contract example
- `npm run install-sdk` - Install the latest SDK version

## Troubleshooting

### Connection Issues
If you encounter network errors:
1. Check your internet connection
2. Verify the RPC URL is accessible
3. Try a different RPC endpoint

### Contract Errors
If contract calls fail:
1. Verify the contract addresses are correct
2. Ensure the contract is deployed on the target network
3. Check if the contract ABI matches

### Signature Issues
If signature generation fails:
1. Ensure the signer has a valid private key
2. Check that the domain and message parameters are correct
3. Verify the chain ID matches the network

## Learn More

- [ERC-7806 Specification](https://eips.ethereum.org/EIPS/eip-7806)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) 