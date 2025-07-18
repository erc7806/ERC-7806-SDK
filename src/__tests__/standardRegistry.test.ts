/**
 * Tests for StandardRegistry functionality
 */

import { ethers } from 'ethers';
import {
  createStandardRegistryDomain,
  getStandardRegistryTypedDataHash,
  signStandardRegistryPermission,
  recoverStandardRegistrySigner,
  StandardRegistrySDK,
  STANDARD_REGISTRY_TYPES,
} from '../index';

// Mock signer for testing
const mockSigner = {
  signTypedData: jest.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b'),
  getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890')
} as unknown as ethers.Signer;

describe('StandardRegistry SDK', () => {
  const contractAddress = '0x1234567890123456789012345678901234567890';
  const chainId = 1;
  const standardAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
  const nonce = '12345';

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
        standardAddress,
        parseInt(nonce)
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
      const testNonce = 12345;
      const [signature, signerAddress] = await signStandardRegistryPermission(
        mockSigner,
        contractAddress,
        chainId,
        true,
        standardAddress,
        testNonce
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(mockSigner.signTypedData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'StandardRegistry',
          version: '2',
          chainId,
          verifyingContract: contractAddress
        }),
        { Permission: STANDARD_REGISTRY_TYPES.Permission },
        expect.objectContaining({
          registering: true,
          standard: standardAddress,
          nonce: testNonce.toString()
        })
      );
      expect(mockSigner.getAddress).toHaveBeenCalled();
    });

    test('should sign permission and return signer address', async () => {
      const testNonce = 67890;
      const [signature, signerAddress] = await signStandardRegistryPermission(
        mockSigner,
        contractAddress,
        chainId,
        false,
        standardAddress,
        testNonce
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
    });
  });

  describe('Real world example test', () => {
    test('should recover correct signer from provided signature', () => {
      // Test data provided by user
      const testContractAddress = '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8';
      const testChainId = 11155111;
      const testStandard = '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39';
      const testRegistering = true;
      const testNonce = 1743744596651;
      const testSignature = '0x835cdaf7384aa7ad82559926e6dda6470c7ad368a354e019cbc4a59be0a9d95a52430d807d77bd490db70fdbf45056fca9dc4626b88b8e87ea06d37d187225f61b';
      const expectedSigner = '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13';

      // Generate the typed data hash
      const typedDataHash = getStandardRegistryTypedDataHash(
        testContractAddress,
        testChainId,
        testRegistering,
        testStandard,
        testNonce
      );

      expect(typedDataHash).toBeDefined();
      expect(typedDataHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

      // Recover the signer
      const recoveredSigner = recoverStandardRegistrySigner(
        testContractAddress,
        testChainId,
        testRegistering,
        testStandard,
        testNonce,
        testSignature
      );

      expect(recoveredSigner.toLowerCase()).toBe(expectedSigner.toLowerCase());
    });
  });

  describe('StandardRegistrySDK class', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should initialize correctly', () => {
      const sdk = new StandardRegistrySDK(contractAddress, chainId);
      const domain = sdk.getDomain();
      
      expect(domain.verifyingContract).toBe(contractAddress);
      expect(domain.chainId).toBe(chainId);
    });

    test('should get typed data hash using SDK class', () => {
      const sdk = new StandardRegistrySDK(contractAddress, chainId);
      const hash = sdk.getTypedDataHash(true, standardAddress, parseInt(nonce));
      
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should sign permission using SDK class', async () => {
      const sdk = new StandardRegistrySDK(contractAddress, chainId);
      const [signature, signerAddress] = await sdk.signPermission(
        mockSigner,
        true,
        standardAddress,
        67890
      );

      expect(signature).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b');
      expect(signerAddress).toBe('0x1234567890123456789012345678901234567890');
    });

    test('should recover signer using SDK class', () => {
      const sdk = new StandardRegistrySDK(contractAddress, chainId);
      
      // Use the real world test data
      const testContractAddress = '0x1EcBE25525F6e6cDe8631e602Df6D55D3967cDF8';
      const testChainId = 11155111;
      const testStandard = '0xeEDb221A8fA468A5469F1770Ca13cB6e20EdCB39';
      const testNonce = 1743744596651;
      const testSignature = '0x835cdaf7384aa7ad82559926e6dda6470c7ad368a354e019cbc4a59be0a9d95a52430d807d77bd490db70fdbf45056fca9dc4626b88b8e87ea06d37d187225f61b';
      const expectedSigner = '0x0970c10Ea0605dBD54564AcFcd93237865Ee7E13';

      const testSdk = new StandardRegistrySDK(testContractAddress, testChainId);
      const recoveredSigner = testSdk.recoverSigner(
        true,
        testStandard,
        testNonce,
        testSignature
      );

      expect(recoveredSigner.toLowerCase()).toBe(expectedSigner.toLowerCase());
    });
  });

  describe('Type definitions', () => {
    test('should have correct type structure for Permission', () => {
      const permissionType = STANDARD_REGISTRY_TYPES.Permission;
      
      expect(permissionType).toHaveLength(3);
      expect(permissionType[0]).toEqual({ name: 'registering', type: 'bool' });
      expect(permissionType[1]).toEqual({ name: 'standard', type: 'address' });
      expect(permissionType[2]).toEqual({ name: 'nonce', type: 'uint256' });
    });

    test('should have correct type structure for EIP712Domain', () => {
      const domainType = STANDARD_REGISTRY_TYPES.EIP712Domain;
      
      expect(domainType).toHaveLength(4);
      expect(domainType[0]).toEqual({ name: 'name', type: 'string' });
      expect(domainType[1]).toEqual({ name: 'version', type: 'string' });
      expect(domainType[2]).toEqual({ name: 'chainId', type: 'uint256' });
      expect(domainType[3]).toEqual({ name: 'verifyingContract', type: 'address' });
    });
  });
}); 