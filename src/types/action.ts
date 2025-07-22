// Define action types
export type ActionType = 'TRANSFER_ETH' | 'TRANSFER_ERC20' | 'GENERAL_EXECUTION'

// Define action interface
export interface Action {
  type: ActionType
  receiver?: string
  amount?: string
  tokenAddress?: string
  targetAddress?: string
  calldata?: string
}
