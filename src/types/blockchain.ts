export enum BlockchainEnum {
  UNKNOWN = 'UNKNOWN',
  ETH = 'ETH',
  ETH_SEPOLIA = 'ETH_SEPOLIA',
  ODYSSEY = 'ODYSSEY',
  OP_SEPOLIA = 'OP_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
}

export type BlockchainContext = {
  symbol: BlockchainEnum,
  chainIdNumeric: number,
  isTestnet: boolean,
  explorer: string,
  standardRegistry: `0x${string}`,
  accountImplementation: `0x${string}`,
  relayExecutionStandard: `0x${string}`,
}