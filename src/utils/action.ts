import { AbiCoder } from 'ethers';
import { IERC20 } from './erc20';
import { Action } from '../types/action';

const abiCoder = new AbiCoder();

/**
 * Encodes a TRANSFER_ETH action
 * @param action The action to encode
 * @returns The encoded calldata
 */
export function encodeTransferEth(action: Action): string {
  if (!action.receiver || !action.amount) {
    throw new Error('Missing required fields for TRANSFER_ETH action');
  }

  // For ETH transfer, we just need to encode the receiver and amount
  // The calldata is empty for ETH transfers
  return abiCoder.encode(
    ['address', 'uint256', 'bytes'],
    [action.receiver, action.amount, '0x']
  );
}

/**
 * Encodes a TRANSFER_ERC20 action
 * @param action The action to encode
 * @returns The encoded calldata
 */
export function encodeTransferErc20(action: Action): string {
  if (!action.receiver || !action.amount || !action.tokenAddress) {
    throw new Error('Missing required fields for TRANSFER_ERC20 action');
  }

  // Encode the transfer function call
  const transferCalldata = IERC20.encodeFunctionData('transfer', [
    action.receiver,
    action.amount
  ]);

  // Encode the final call with token address, 0 ETH amount, and the transfer calldata
  // This matches the Solidity example: abi.encode(tokenAddress, uint256(0), abi.encodeWithSelector(IERC20.transfer.selector, address(receiver), amount));
  return abiCoder.encode(
    ['address', 'uint256', 'bytes'],
    [action.tokenAddress, '0', transferCalldata]
  );
}

/**
 * Encodes a GENERAL_EXECUTION action
 * @param action The action to encode
 * @returns The encoded calldata
 */
export function encodeGeneralExecution(action: Action): string {
  if (!action.targetAddress || !action.calldata) {
    throw new Error('Missing required fields for GENERAL_EXECUTION action');
  }

  // For general execution, we encode the target address, amount, and calldata
  return abiCoder.encode(
    ['address', 'uint256', 'bytes'],
    [action.targetAddress, action.amount, action.calldata]
  );
}

/**
 * Encodes an action based on its type
 * @param action The action to encode
 * @returns The encoded calldata
 */
export function encodeAction(action: Action): string {
  switch (action.type) {
    case 'TRANSFER_ETH':
      return encodeTransferEth(action);
    case 'TRANSFER_ERC20':
      return encodeTransferErc20(action);
    case 'GENERAL_EXECUTION':
      return encodeGeneralExecution(action);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
} 