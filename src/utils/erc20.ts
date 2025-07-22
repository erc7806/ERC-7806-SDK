import { ethers } from 'ethers';

// ERC20 ABI for transfer function
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)'
];

// Create an interface for the ERC20 contract
export const IERC20 = new ethers.utils.Interface(ERC20_ABI);