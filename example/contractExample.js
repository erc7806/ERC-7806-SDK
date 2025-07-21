/**
 * Real working example of ERC-7806 SDK Contract Helper Functions
 * This script demonstrates how to use the SDK with a real blockchain connection
 */

const { ethers } = require('ethers');
const { 
  StandardRegistry,
  isStandardRegistered,
  registerStandard,
  unregisterStandard,
  permitStandardRegistration,
  getStandardRegistryContract,
  SDK_VERSION 
} = require('erc-7806-sdk');

console.log('=== ERC-7806 SDK Contract Helper Example ===');
console.log('SDK Version:', SDK_VERSION);
console.log('');

// Configuration
const config = {
  registryAddress: '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8', // StandardRegistry contract
  chainId: 11155111, // Sepolia testnet
  rpcUrl: 'https://eth-sepolia.public.blastapi.io', // Real RPC URL provided
  standardAddress: '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39', // Example standard contract
  signerAddress: '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13', // Example signer address
};

// Initialize provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// Example wallet for demonstration (DO NOT use this private key in production!)
// This is a test private key - replace with your own for real usage
const DEMO_PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

async function main() {
  try {
    console.log('Connecting to Sepolia testnet...');
    console.log('RPC URL:', config.rpcUrl);
    console.log('Registry Address:', config.registryAddress);
    console.log('');

    // Test connection
    const network = await provider.getNetwork();
    console.log('Connected to network:', network.name, 'Chain ID:', Number(network.chainId));
    console.log('');

    // === Example 1: Check Registration Status ===
    console.log('=== 1. Checking Registration Status ===');
    console.log(`Checking if ${config.standardAddress} is registered for ${config.signerAddress}...`);
    
    const status = await isStandardRegistered(
      provider,
      config.registryAddress,
      config.signerAddress,
      config.standardAddress
    );

    console.log('Registration Status Result:');
    console.log('- Is registered:', status.isRegistered);
    if (status.error) {
      console.log('- Error:', status.error);
    }
    console.log('');

    // === Example 2: Using the SDK Class ===
    console.log('=== 2. Using StandardRegistrySDK Class ===');
    
    const sdk = new StandardRegistry(config.registryAddress, config.chainId);
    console.log('SDK instance created for registry at:', config.registryAddress);
    
    // Check registration using SDK
    const sdkStatus = await sdk.isStandardRegistered(
      provider,
      config.signerAddress,
      config.standardAddress
    );
    
    console.log('SDK Registration Check:');
    console.log('- Is registered:', sdkStatus.isRegistered);
    if (sdkStatus.error) {
      console.log('- Error:', sdkStatus.error);
    }
    console.log('');

    // === Example 3: Getting Contract Instance ===
    console.log('=== 3. Direct Contract Interaction ===');
    
    const contract = getStandardRegistryContract(config.registryAddress, provider);
    console.log('Contract instance created');
    
    // Check registration directly on contract
    try {
      const isRegisteredDirect = await contract.isRegistered(
        config.signerAddress,
        config.standardAddress
      );
      console.log('Direct contract call result:', isRegisteredDirect);
    } catch (error) {
      console.log('Direct contract call error:', error.message);
    }
    console.log('');

    // === Example 4: EIP-712 Signature Demo ===
    console.log('=== 4. EIP-712 Signature Generation ===');
    
    // Create a demo signer (for signature generation demo only)
    const demoSigner = new ethers.Wallet(DEMO_PRIVATE_KEY, provider);
    const demoSignerAddress = await demoSigner.getAddress();
    console.log('Demo signer address:', demoSignerAddress);
    
    // Generate a signature for registration
    const nonce = Math.floor(Math.random() * 1000000000000000000);
    console.log('Generated nonce:', nonce);
    
    try {
      const [signature, signerAddr] = await sdk.signPermission(
        demoSigner,
        true, // registering = true
        config.standardAddress,
        nonce
      );
      
      console.log('EIP-712 Signature generated:');
      console.log('- Signature:', signature.substring(0, 20) + '...');
      console.log('- Signer address:', signerAddr);
      
      // Verify signature by recovering signer
      const recoveredSigner = sdk.recoverSigner(
        true,
        config.standardAddress,
        nonce,
        signature
      );
      
      console.log('- Recovered signer:', recoveredSigner);
      console.log('- Signature valid:', recoveredSigner.toLowerCase() === signerAddr.toLowerCase());
      
    } catch (error) {
      console.log('Signature generation error:', error.message);
    }
    console.log('');

    // === Example 5: Transaction Demonstration ===
    console.log('=== 5. Transaction Examples (Read-Only) ===');
    console.log('Note: The following examples show how to prepare transactions.');
    console.log('Actual execution requires a funded wallet and gas fees.');
    console.log('');

    // Show how to prepare a registration transaction
    console.log('Registration Transaction Example:');
    console.log(`
// To register a standard:
const signer = new ethers.Wallet(privateKey, provider);
const result = await registerStandard(
  signer,
  '${config.registryAddress}',
  '${config.standardAddress}',
  ${nonce}
);

if (result.success) {
  console.log('Registration successful!');
  console.log('Transaction hash:', result.transactionHash);
} else {
  console.log('Registration failed:', result.error);
}
`);

    console.log('Gasless Registration Example:');
    console.log(`
// To register using a signature (gasless for the signer):
const [signature, signerAddress] = await sdk.signPermission(
  signer,
  true, // registering
  '${config.standardAddress}',
  ${nonce}
);

// Someone else can execute this with gas:
const result = await permitStandardRegistration(
  relayerSigner, // The relayer pays gas
  '${config.registryAddress}',
  signerAddress,
  '${config.standardAddress}',
  true, // registering
  ${nonce},
  signature
);
`);

    console.log('');
    console.log('=== Example Complete ===');
    console.log('✅ Successfully connected to Sepolia testnet');
    console.log('✅ Checked registration status');
    console.log('✅ Demonstrated SDK class usage');
    console.log('✅ Generated EIP-712 signatures');
    console.log('✅ Showed transaction preparation');
    console.log('');
    console.log('To execute actual transactions:');
    console.log('1. Replace DEMO_PRIVATE_KEY with your own private key');
    console.log('2. Ensure your wallet has Sepolia ETH for gas fees');
    console.log('3. Use the registerStandard() or permitStandardRegistration() functions');

  } catch (error) {
    console.error('Example execution error:', error);
    if (error.code === 'NETWORK_ERROR') {
      console.error('Network connection failed. Please check your internet connection and RPC URL.');
    }
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 