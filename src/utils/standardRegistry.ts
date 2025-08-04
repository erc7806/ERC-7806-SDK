/**
 * StandardRegistry utilities for EIP-712 signature generation
 */

import { 
  Signer, 
  TypedDataEncoder, 
  verifyTypedData, 
} from 'ethers';
import { 
  StandardRegistryDomain, 
  StandardRegistryPermission
} from '../types/standardRegistry';

// EIP-712 type definitions for StandardRegistry
const permissionTypes = {
  Permission: [
    { name: 'registering', type: 'bool' },
    { name: 'standard', type: 'address' },
    { name: 'nonce', type: 'uint256' },
  ],
};

/**
 * Create StandardRegistry domain for EIP-712
 */
export function createStandardRegistryDomain(
  contractAddress: string,
  chainId: number
): StandardRegistryDomain {
  return {
    name: 'StandardRegistry',
    version: '2',
    chainId,
    verifyingContract: contractAddress,
  };
}

/**
 * Generate unsigned typed data hash for StandardRegistry Permission
 * This can be used to recover the signer address from a signature
 */
export function getStandardRegistryTypedDataHash(
  contractAddress: string,
  chainId: number,
  registering: boolean,
  standard: string,
  nonce: BigInt
): string {
  const domain = createStandardRegistryDomain(contractAddress, chainId);
  const permission: StandardRegistryPermission = {
    registering,
    standard,
    nonce,
  };

  // Use ethers to compute the typed data hash
  return TypedDataEncoder.hash(domain, permissionTypes, permission);
}

/**
 * Sign StandardRegistry Permission using EIP-712
 * This matches the Solidity implementation that validates the signature
 */
export async function signStandardRegistryPermission(
  signer: Signer,
  contractAddress: string,
  chainId: number,
  registering: boolean,
  standard: string,
  nonce: BigInt
): Promise<[string, string]> {
  const domain = createStandardRegistryDomain(contractAddress, chainId);
  const permission: StandardRegistryPermission = {
    registering,
    standard,
    nonce,
  };

  // Sign the typed data using ethers.js v6
  const signature = await signer.signTypedData(
    domain,
    permissionTypes,
    permission
  );

  // Get the signer address
  const signerAddress = await signer.getAddress();

  return [signature, signerAddress];
}

/**
 * Recover signer address from StandardRegistry signature
 * This can be used to verify signatures
 */
export function recoverStandardRegistrySigner(
  contractAddress: string,
  chainId: number,
  registering: boolean,
  standard: string,
  nonce: BigInt,
  signature: string
): string {
  const domain = createStandardRegistryDomain(contractAddress, chainId);
  const permission: StandardRegistryPermission = {
    registering,
    standard,
    nonce,
  };

  return verifyTypedData(domain, permissionTypes, permission, signature);
} 