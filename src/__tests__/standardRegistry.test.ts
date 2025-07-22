/**
 * Tests for StandardRegistry functionality
 */

import { type Signer } from 'ethers';
import {
  createStandardRegistryDomain,
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
  StandardRegistry,
} from '../index';

// Mock signer for testing
const mockSigner = {
  signTypedData: jest.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b'),
  getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890')
} as unknown as Signer;

describe('StandardRegistry SDK', () => {
  const contractAddress = '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8';
  const chainId = 11155111;
  const standard = '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39';

  describe('Domain creation', () => {
    test('should create correct StandardRegistry domain', () => {
      const domain = createStandardRegistryDomain(contractAddress, chainId);

      expect(domain.name).toBe('StandardRegistry');
      expect(domain.version).toBe('2');
      expect(domain.chainId).toBe(chainId);
      expect(domain.verifyingContract).toBe(contractAddress);
    });
  });

  describe('Typed data hash generation', () => {
    test('should generate typed data hash correctly', () => {
      const hash = getStandardRegistryTypedDataHash(
        contractAddress,
        chainId,
        true,
        standard,
        12345
      );

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('Signing functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should sign permission with provided nonce', async () => {
      const [signature, signerAddress] = await signStandardRegistryPermission(
        mockSigner,
        contractAddress,
        chainId,
        true,
        standard,
        12345
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
      expect((mockSigner as any).signTypedData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StandardRegistry',
          version: '2',
          chainId,
          verifyingContract: contractAddress
        }),
        {
          Permission: [
            { name: 'registering', type: 'bool' },
            { name: 'standard', type: 'address' },
            { name: 'nonce', type: 'uint256' },
          ],
        },
        expect.objectContaining({
          registering: true,
          standard: standard,
          nonce: 12345
        })
      );
      expect(mockSigner.getAddress).toHaveBeenCalled();
    });

    test('should sign permission and return signer address', async () => {
      const [signature, signerAddress] = await signStandardRegistryPermission(
        mockSigner,
        contractAddress,
        chainId,
        false,
        standard,
        67890
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
    });
  });

  describe('Real world example test', () => {
    test('should recover correct signer from provided signature', () => {
      // Test data provided by user
      const registering = true;
      const nonce = 1743744596651;
      const signature = '0x835cdaf7384aa7ad82559926e6dda6470c7ad368a354e019cbc4a59be0a9d95a52430d807d77bd490db70fdbf45056fca9dc4626b88b8e87ea06d37d187225f61b';
      const expectedSigner = '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13';

      // Generate the typed data hash
      const typedDataHash = getStandardRegistryTypedDataHash(
        contractAddress,
        chainId,
        registering,
        standard,
        nonce
      );

      expect(typedDataHash).toBeDefined();
      expect(typedDataHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

      // Recover the signer
      const recoveredSigner = recoverStandardRegistrySigner(
        contractAddress,
        chainId,
        registering,
        standard,
        nonce,
        signature
      );

      expect(recoveredSigner.toLowerCase()).toBe(expectedSigner.toLowerCase());
    });
  });

  describe('StandardRegistrySDK class', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should initialize correctly', () => {
      const sdk = new StandardRegistry(contractAddress, chainId);
      const domain = sdk.getDomain();

      expect(domain.verifyingContract).toBe(contractAddress);
      expect(domain.chainId).toBe(chainId);
    });

    test('should get typed data hash using SDK class', () => {
      const sdk = new StandardRegistry(contractAddress, chainId);
      const hash = sdk.getTypedDataHash(true, standard, 12345);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should sign permission using SDK class', async () => {
      const sdk = new StandardRegistry(contractAddress, chainId);
      const [signature, signerAddress] = await sdk.signPermission(
        mockSigner,
        true,
        standard,
        67890
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
    });

    test('should recover signer using SDK class', () => {
      // Use the real world test data
      const nonce = 1743744596651;
      const signature = '0x835cdaf7384aa7ad82559926e6dda6470c7ad368a354e019cbc4a59be0a9d95a52430d807d77bd490db70fdbf45056fca9dc4626b88b8e87ea06d37d187225f61b';
      const expectedSigner = '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13';

      const sr = new StandardRegistry(contractAddress, chainId);
      const recoveredSigner = sr.recoverSigner(
        true,
        standard,
        nonce,
        signature
      );

      expect(recoveredSigner.toLowerCase()).toBe(expectedSigner.toLowerCase());
    });
  });
}); 