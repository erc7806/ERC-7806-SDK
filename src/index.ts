/**
 * ERC-7806 SDK - StandardRegistry Component
 */

// Types
export type {
  StandardRegistryDomain,
  StandardRegistryPermission,
  SigningResult,
} from './types/standardRegistry';

// Utilities
export {
  createStandardRegistryDomain,
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
  STANDARD_REGISTRY_TYPES,
} from './utils/standardRegistry';

// Constants
export const SDK_VERSION = '0.0.2';

// Import ethers and functions for the class implementation
import { type Signer } from 'ethers';
import { 
  createStandardRegistryDomain as _createStandardRegistryDomain,
  signStandardRegistryPermission as _signStandardRegistryPermission,
  getStandardRegistryTypedDataHash as _getStandardRegistryTypedDataHash,
  recoverStandardRegistrySigner as _recoverStandardRegistrySigner
} from './utils/standardRegistry';

/**
 * Main SDK class for StandardRegistry operations
 */
export class StandardRegistrySDK {
  private contractAddress: string;
  private chainId: number;

  constructor(contractAddress: string, chainId: number) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
  }

  /**
   * Get typed data hash for StandardRegistry permission
   */
  getTypedDataHash(
    registering: boolean,
    standard: string,
    nonce: number
  ): string {
    return _getStandardRegistryTypedDataHash(
      this.contractAddress,
      this.chainId,
      registering,
      standard,
      nonce
    );
  }

  /**
   * Sign permission data for StandardRegistry
   */
  async signPermission(
    signer: Signer,
    registering: boolean,
    standard: string,
    nonce: number
  ): Promise<[string, string]> {
    return _signStandardRegistryPermission(
      signer,
      this.contractAddress,
      this.chainId,
      registering,
      standard,
      nonce
    );
  }

  /**
   * Recover signer address from signature
   */
  recoverSigner(
    registering: boolean,
    standard: string,
    nonce: number,
    signature: string
  ): string {
    return _recoverStandardRegistrySigner(
      this.contractAddress,
      this.chainId,
      registering,
      standard,
      nonce,
      signature
    );
  }

  /**
   * Get the domain separator for this StandardRegistry instance
   */
  getDomain() {
    return _createStandardRegistryDomain(this.contractAddress, this.chainId);
  }
} 