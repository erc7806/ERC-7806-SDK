/**
 * ERC-7806 SDK - StandardRegistry Component
 */

// Types
export type {
  StandardRegistryDomain,
  StandardRegistryPermission,
  SigningResult,
} from './types/standardRegistry';

export type { ContractCallResult } from './types/contractHelper';

export type { Action, ActionType } from './types/action';

// Utilities
export {
  createStandardRegistryDomain,
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
} from './utils/standardRegistry';

// Contract Helpers
export {
  isStandardRegistered,
  updateStandardRegistration,
  registerStandard,
  unregisterStandard,
  permitStandardRegistration,
  getStandardRegistryContract,
} from './utils/standardRegistryContract';

// Action Encoding
export {
  encodeAction,
  encodeTransferEth,
  encodeTransferErc20,
  encodeGeneralExecution,
} from './utils/action';

// ERC20 Interface
export { IERC20 } from './utils/erc20';

// Relay Execution
export { buildRelayExecutionIntent } from './utils/relayExecution';

// Constants
export const SDK_VERSION = '0.0.4';

// Import ethers and functions for the class implementation
import { type Signer, ethers } from 'ethers';
import {
  createStandardRegistryDomain as _createStandardRegistryDomain,
  signStandardRegistryPermission as _signStandardRegistryPermission,
  getStandardRegistryTypedDataHash as _getStandardRegistryTypedDataHash,
  recoverStandardRegistrySigner as _recoverStandardRegistrySigner
} from './utils/standardRegistry';
import {
  isStandardRegistered as _isStandardRegistered,
  updateStandardRegistration as _updateStandardRegistration,
  registerStandard as _registerStandard,
  unregisterStandard as _unregisterStandard,
  permitStandardRegistration as _permitStandardRegistration,
  getStandardRegistryContract as _getStandardRegistryContract
} from './utils/standardRegistryContract';
import { Action } from './types/action';
import { buildRelayExecutionIntent } from './utils/relayExecution';

/**
 * Main SDK class for StandardRegistry operations
 */
export class StandardRegistry {
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

  /**
   * Check if a standard is registered for a specific signer
   */
  async isStandardRegistered(
    provider: ethers.providers.JsonRpcProvider,
    signerAddress: string,
    standardAddress: string
  ) {
    return _isStandardRegistered(
      provider,
      this.contractAddress,
      signerAddress,
      standardAddress
    );
  }

  /**
   * Register a standard using direct transaction
   */
  async registerStandard(
    signer: Signer,
    standardAddress: string,
    nonce?: number
  ) {
    return _registerStandard(
      signer,
      this.contractAddress,
      standardAddress,
      nonce
    );
  }

  /**
   * Unregister a standard using direct transaction
   */
  async unregisterStandard(
    signer: Signer,
    standardAddress: string,
    nonce?: number
  ) {
    return _unregisterStandard(
      signer,
      this.contractAddress,
      standardAddress,
      nonce
    );
  }

  /**
   * Register or unregister using a signature (gasless)
   */
  async permitStandardRegistration(
    signer: Signer,
    signerAddress: string,
    standardAddress: string,
    registering: boolean,
    nonce: number,
    signature: string
  ) {
    return _permitStandardRegistration(
      signer,
      this.contractAddress,
      signerAddress,
      standardAddress,
      registering,
      nonce,
      signature
    );
  }

  /**
   * Get the contract instance for direct interaction
   */
  getContract(signerOrProvider: Signer | ethers.providers.JsonRpcProvider) {
    return _getStandardRegistryContract(this.contractAddress, signerOrProvider);
  }
}

/**
 * Class for building relay execution intents
 */
export class RelayExecution {
  private contractAddress: string;
  private chainId: number;

  constructor(contractAddress: string, chainId: number) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
  }

  /**
   * Build a relay execution intent
   */
  buildIntent(
    paymentTokenAddress: string,
    paymentTokenAmount: bigint,
    actions: Action[],
    expiration: number,
    signer: Signer,
    relayerAddress?: string
  ) {
    return buildRelayExecutionIntent(this.chainId, this.contractAddress, paymentTokenAddress, paymentTokenAmount, actions, expiration, signer, relayerAddress);
  }
}