/**
 * Types for StandardRegistry component
 */

export interface StandardRegistryDomain {
  name: string; // "StandardRegistry"
  version: string; // "2"
  chainId: number;
  verifyingContract: string; // StandardRegistry contract address
}

export interface StandardRegistryPermission {
  registering: boolean;
  standard: string; // address
  nonce: BigInt; // uint256
}

export interface SigningResult {
  signature: string;
  signerAddress: string;
} 

export interface RegistrationStatus {
  isRegistered: boolean;
  error?: string;
}