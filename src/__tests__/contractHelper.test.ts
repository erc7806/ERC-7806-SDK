/**
 * Tests for contract helper functions
 */

import { ethers } from 'ethers';

describe('Contract Helper Functions', () => {
  const registryAddress = "0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8";
  const standardAddress = "0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39";
  const signerAddress = "0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13";
  const rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";

  describe('Error handling', () => {
    test('should handle invalid inputs gracefully', async () => {
      const { isStandardRegistered } = await import('../utils/standardRegistryContract');
      
      // Test with invalid provider (empty object)
      const invalidProvider = {} as ethers.providers.JsonRpcProvider;
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

  describe('Integration: Sepolia', () => {
    test('should check registration status on Sepolia with real data', async () => {
      const { isStandardRegistered } = await import('../utils/standardRegistryContract');
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const network = await provider.getNetwork();
      console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);

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
}); 