/**
 * Types for contract helper functionality
 */

export interface ContractCallResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface RegistrationStatus {
  isRegistered: boolean;
  error?: string;
}

export interface StandardRegistryContract {
  address: string;
  chainId: number;
  provider: any; // JsonRpcProvider
} 