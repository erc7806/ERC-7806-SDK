/**
 * Tests for contract helper functions
 */

import { STANDARD_REGISTRY_TYPES } from '../utils/standardRegistry';
import { ethers } from 'ethers';

describe('Contract Helper Functions', () => {
  const registryAddress = '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8';
  const signerAddress = '0x1234567890123456789012345678901234567890';
  const standardAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
  const chainId = 11155111;
  const nonce = 1234567890;

  describe('Type definitions', () => {
    test('should have correct StandardRegistry types', () => {
      expect(STANDARD_REGISTRY_TYPES).toHaveProperty('Permission');
      expect(STANDARD_REGISTRY_TYPES).toHaveProperty('EIP712Domain');
      
      expect(STANDARD_REGISTRY_TYPES.Permission).toEqual([
        { name: 'registering', type: 'bool' },
        { name: 'standard', type: 'address' },
        { name: 'nonce', type: 'uint256' },
      ]);
    });
  });

  describe('Function exports', () => {
    test('should export all contract helper functions', async () => {
      const contractHelper = await import('../utils/contractHelper');
      
      expect(contractHelper.isStandardRegistered).toBeDefined();
      expect(contractHelper.registerStandard).toBeDefined();
      expect(contractHelper.unregisterStandard).toBeDefined();
      expect(contractHelper.permitStandardRegistration).toBeDefined();
      expect(contractHelper.getStandardRegistryContract).toBeDefined();
    });
  });

  describe('Error handling', () => {
    test('should handle invalid inputs gracefully', async () => {
      const { isStandardRegistered } = await import('../utils/contractHelper');
      
      // Test with invalid provider (empty object)
      const invalidProvider = {} as any;
      const result = await isStandardRegistered(
        invalidProvider,
        registryAddress,
        signerAddress,
        standardAddress
      );

      expect(result.isRegistered).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
}); 

describe('Integration: Sepolia', () => {
  const registryAddress = "0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8";
  const standardAddress = "0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39";
  const signerAddress = "0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13";
  const rpcUrl = "https://eth-sepolia.public.blastapi.io";

  test('should check registration status on Sepolia with real data', async () => {
    const { isStandardRegistered } = await import('../utils/contractHelper');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    expect(provider instanceof ethers.JsonRpcProvider).toBe(true);

    const result = await isStandardRegistered(
      provider,
      registryAddress,
      signerAddress,
      standardAddress
    );

    expect(typeof result.isRegistered).toBe('boolean');
    expect(result.error).toBeUndefined();
    // Optionally, log the result for manual inspection
    console.log('Sepolia isStandardRegistered result:', result);
  });
}); 