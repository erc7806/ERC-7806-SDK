/**
 * StandardRegistry contract helper utilities
 */

import { ethers, type JsonRpcProvider, type Signer } from 'ethers';
import type { ContractCallResult, RegistrationStatus } from '../types/contractHelper';

// StandardRegistry contract ABI
const STANDARD_REGISTRY_ABI = [
  'function update(bool registering, address standard, uint256 nonce) external',
  'function isRegistered(address signer, address standard) external view returns (bool)',
  'function permit(bool registering, address signer, address standard, uint256 nonce, bytes calldata signature)'
];

/**
 * Check if a standard is registered for a specific signer
 */
export async function isStandardRegistered(
  provider: JsonRpcProvider,
  registryAddress: string,
  signerAddress: string,
  standardAddress: string
): Promise<RegistrationStatus> {
  try {
    const standardRegistry = new ethers.Contract(
      registryAddress,
      STANDARD_REGISTRY_ABI,
      provider
    ); // explicitly add runner;

    // const network = await provider.getNetwork();
    // console.log('Connected to network:', network.name, 'Chain ID:', Number(network.chainId));

    console.log('provider:', provider instanceof ethers.JsonRpcProvider);
    console.log('blockNumber:', await provider.getBlockNumber());
    console.log('signerAddress:', signerAddress, typeof signerAddress, signerAddress.length);
    console.log('standardAddress:', standardAddress, typeof standardAddress, standardAddress.length);
    console.log('ethers.isAddress(signerAddress):', ethers.isAddress(signerAddress));
    console.log('ethers.isAddress(standardAddress):', ethers.isAddress(standardAddress));

    if (!(provider instanceof ethers.JsonRpcProvider)) {
      throw new Error('Invalid provider');
    }

    const isRegistered = await standardRegistry.isRegistered(
      signerAddress,
      standardAddress
    );

    return {
      isRegistered: Boolean(isRegistered),
    };
  } catch (error) {
    console.error('Failed to check standard registration:', error);
    return {
      isRegistered: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Register or unregister a standard using direct transaction
 */
export async function updateStandardRegistration(
  signer: Signer,
  registryAddress: string,
  standardAddress: string,
  registering: boolean,
  nonce?: number
): Promise<ContractCallResult> {
  try {
    const standardRegistry = new ethers.Contract(
      registryAddress,
      STANDARD_REGISTRY_ABI,
      signer
    );

    // Use provided nonce or generate a random one
    const txNonce = nonce || BigInt(Math.floor(Math.random() * 1000000000000000000));
    
    // Create the transaction
    const tx = await standardRegistry.update(
      registering,
      standardAddress,
      txNonce
    );
    
    if (!tx) {
      throw new Error('Failed to create transaction');
    }
    
    // Wait for the transaction to be mined
    await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash,
    };
  } catch (error) {
    console.error('Failed to update standard registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Register a standard using direct transaction (convenience function)
 */
export async function registerStandard(
  signer: Signer,
  registryAddress: string,
  standardAddress: string,
  nonce?: number
): Promise<ContractCallResult> {
  return updateStandardRegistration(
    signer,
    registryAddress,
    standardAddress,
    true,
    nonce
  );
}

/**
 * Unregister a standard using direct transaction (convenience function)
 */
export async function unregisterStandard(
  signer: Signer,
  registryAddress: string,
  standardAddress: string,
  nonce?: number
): Promise<ContractCallResult> {
  return updateStandardRegistration(
    signer,
    registryAddress,
    standardAddress,
    false,
    nonce
  );
}

/**
 * Register or unregister a standard using a signature (gasless)
 */
export async function permitStandardRegistration(
  signer: Signer,
  registryAddress: string,
  signerAddress: string,
  standardAddress: string,
  registering: boolean,
  nonce: number,
  signature: string
): Promise<ContractCallResult> {
  try {
    const standardRegistry = new ethers.Contract(
      registryAddress,
      STANDARD_REGISTRY_ABI,
      signer
    );
    
    // Create the permit transaction
    const tx = await standardRegistry.permit(
      registering,
      signerAddress,
      standardAddress,
      nonce,
      signature
    );
    
    if (!tx) {
      throw new Error('Failed to create permit transaction');
    }
    
    // Wait for the transaction to be mined
    await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash,
    };
  } catch (error) {
    console.error('Failed to permit standard registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}



/**
 * Get the StandardRegistry contract instance
 */
export function getStandardRegistryContract(
  registryAddress: string,
  signerOrProvider: Signer | JsonRpcProvider
): ethers.Contract {
  return new ethers.Contract(
    registryAddress,
    STANDARD_REGISTRY_ABI,
    signerOrProvider
  );
} 