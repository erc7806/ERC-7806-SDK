# ERC-7806 SDK Example

This example demonstrates how to use the published `erc-7806-sdk` package for StandardRegistry operations.

## Installation

```bash
npm install
```

This will install the `erc-7806-sdk` package from npm.

## Running the Example

```bash
npm start
```

## What the Example Demonstrates

### 1. Generate Typed Data Hash
Shows how to generate a typed data hash for StandardRegistry permissions using `getStandardRegistryTypedDataHash()`.

### 2. SDK Class Usage
Demonstrates using the `StandardRegistrySDK` class for a more object-oriented approach.

### 3. Real-world Signature Recovery
Verifies the implementation by recovering a signer address from a real signature. This test uses actual data:
- Contract: `0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8`
- Chain ID: `11155111` (Sepolia testnet)
- Expected Signer: `0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13`

### 4. Wallet Integration Pattern
Shows the pseudo-code pattern for integrating with real wallets like MetaMask.

## Key Functions Demonstrated

```javascript
const { 
  StandardRegistrySDK, 
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
  SDK_VERSION 
} = require('erc-7806-sdk');
```

## Expected Output

When you run `npm start`, you should see:
- ✅ SDK Version: 0.0.1
- ✅ Generated typed data hashes
- ✅ Signature recovery test with "Match: true"
- ✅ Wallet integration pseudo-code

This confirms the SDK is working correctly with the ERC-7806 StandardRegistry component! 