/**
 * Example usage of the ERC-7806 StandardRegistry SDK
 */

const { 
  StandardRegistrySDK, 
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
  SDK_VERSION 
} = require('erc-7806-sdk');

console.log('ERC-7806 SDK Version:', SDK_VERSION);
console.log('');

// Example 1: Generate typed data hash
console.log('=== Example 1: Generate Typed Data Hash ===');

const contractAddress = '0x1234567890123456789012345678901234567890';
const chainId = 1; // Ethereum Mainnet
const registering = true;
const standardAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const nonce = 12345;

const typedDataHash = getStandardRegistryTypedDataHash(
  contractAddress,
  chainId,
  registering,
  standardAddress,
  nonce
);

console.log('Generated Typed Data Hash:', typedDataHash);
console.log('');

// Example 2: Using the SDK class
console.log('=== Example 2: SDK Class Approach ===');

const sdk = new StandardRegistrySDK(contractAddress, chainId);

const sdkHash = sdk.getTypedDataHash(false, standardAddress, 67890);
console.log('SDK Generated Hash:', sdkHash);
console.log('');

// Example 3: Real-world signature recovery test
console.log('=== Example 3: Real-world Signature Recovery ===');

// Test data provided by user
const testContractAddress = '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8';
const testChainId = 11155111;
const testStandard = '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39';
const testNonce = 1743744596651;
const testSignature = '0x835cdaf7384aa7ad82559926e6dda6470c7ad368a354e019cbc4a59be0a9d95a52430d807d77bd490db70fdbf45056fca9dc4626b88b8e87ea06d37d187225f61b';

const recoveredSigner = recoverStandardRegistrySigner(
  testContractAddress,
  testChainId,
  true, // registering
  testStandard,
  testNonce,
  testSignature
);

console.log('Recovered Signer:', recoveredSigner);
console.log('Expected Signer:', '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13');
console.log('Match:', recoveredSigner.toLowerCase() === '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13'.toLowerCase());
console.log('');

// Example 4: How to use with a real wallet (pseudo-code)
console.log('=== Example 4: Signing with Wallet (Pseudo-code) ===');
console.log(`
// In a real application, you would:

import { ethers } from 'ethers';
import { signStandardRegistryPermission } from 'erc-7806-sdk';

// Connect to wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Generate a nonce (could be timestamp or from backend)
const nonce = Date.now();

// Sign standard registration
const [signature, signerAddress] = await signStandardRegistryPermission(
  signer,  // Note: takes signer, not provider
  '${contractAddress}',
  ${chainId},
  true,    // registering = true for registration
  '${standardAddress}',
  nonce    // nonce is now required
);

console.log('Signature:', signature);
console.log('Signer Address:', signerAddress);

// Or using the SDK class:
const sdk = new StandardRegistrySDK('${contractAddress}', ${chainId});
const [signature2, signerAddress2] = await sdk.signPermission(signer, true, '${standardAddress}', nonce);
`); 