/**
 * StandardRegistry contract helper utilities
 */

import { ethers, Signer } from 'ethers';
import type { ContractCallResult } from '../types/contractHelper';
import type { RegistrationStatus } from '../types/standardRegistry';

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
  provider: ethers.providers.JsonRpcProvider,
  registryAddress: string,
  signerAddress: string,
  standardAddress: string
): Promise<RegistrationStatus> {
  try {
    const standardRegistryContract = getStandardRegistryContract(registryAddress, provider);

    const isRegistered = await standardRegistryContract.isRegistered(
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
  signer: ethers.Signer,
  registryAddress: string,
  standardAddress: string,
  registering: boolean,
  nonce?: number
): Promise<ContractCallResult> {
  try {
    const standardRegistryContract = getStandardRegistryContract(registryAddress, signer);

    // Use provided nonce or generate a random one
    const txNonce = nonce || Math.floor(Math.random() * 1000000000000000000);
    
    // Create the transaction
    const tx = await standardRegistryContract.update(
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
  signer: ethers.Signer,
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
  signer: ethers.Signer,
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
  signer: ethers.Signer,
  registryAddress: string,
  signerAddress: string,
  standardAddress: string,
  registering: boolean,
  nonce: number,
  signature: string
): Promise<ContractCallResult> {
  try {
    const standardRegistryContract = getStandardRegistryContract(registryAddress, signer);
    
    // Create the permit transaction
    const tx = await standardRegistryContract.permit(
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
  signerOrProvider: Signer | ethers.providers.JsonRpcProvider
): ethers.Contract {
  return new ethers.Contract(
    registryAddress,
    STANDARD_REGISTRY_ABI,
    signerOrProvider
  );
} 