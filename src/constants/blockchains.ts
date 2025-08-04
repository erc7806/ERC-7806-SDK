import { BlockchainContext, BlockchainEnum } from "../types/blockchain";

export const Unkonwn: BlockchainContext = {
  symbol: BlockchainEnum.UNKNOWN,
  chainIdNumeric: 0,
  isTestnet: false,
  explorer: '',
  standardRegistry: '0x0000000000000000000000000000000000000000',
  accountImplementation: '0x0000000000000000000000000000000000000000',
  relayExecutionStandard: '0x0000000000000000000000000000000000000000',
}

export const Ethereum: BlockchainContext = {
  symbol: BlockchainEnum.ETH,
  chainIdNumeric: 1,
  isTestnet: false,
  explorer: 'https://eth.blockscout.com',
  standardRegistry: '0x1ecbe25525f6e6cde8631e602df6d55d3967cdf8',
  accountImplementation: '0x843fa27dad1759f4a6d1a1f071b918866e821b23',
  relayExecutionStandard: '0xeedb221a8fa468a5469f1770ca13cb6e20edcb39',
}

export const EthereumSepolia: BlockchainContext = {
  symbol: BlockchainEnum.ETH_SEPOLIA,
  chainIdNumeric: 11155111,
  isTestnet: true,
  explorer: 'https://eth-sepolia.blockscout.com',
  standardRegistry: '0x1ecbe25525f6e6cde8631e602df6d55d3967cdf8',
  accountImplementation: '0x32f30d9a49f79108edbfdba67cbfd1546510e34d',
  relayExecutionStandard: '0xE0E55Ce1C4C914822425e270D4Eb1bF5B7bB824B',
}

export const Odyssey: BlockchainContext = {
  symbol: BlockchainEnum.ODYSSEY,
  chainIdNumeric: 911867,
  isTestnet: true,
  explorer: 'https://odyssey-explorer.ithaca.xyz',
  standardRegistry: "0xa6673924437D5864488CEC4B8fa1654226bb1E8D",
  accountImplementation: "0x072771ACb049F8322647a4beEC00e620dfc2ff14",
  relayExecutionStandard: '0x',
}

export const OptimismSepolia: BlockchainContext = {
  symbol: BlockchainEnum.OP_SEPOLIA,
  chainIdNumeric: 11155420,
  isTestnet: true,
  explorer: 'https://optimism-sepolia.blockscout.com',
  standardRegistry: "0x1ecbe25525f6e6cde8631e602df6d55d3967cdf8",
  accountImplementation: "0x843fa27dad1759f4a6d1a1f071b918866e821b23",
  relayExecutionStandard: '0x74463a2d7e894c6f7197fcbfafc78d8e68f3a10a',
}

export const BaseSepolia: BlockchainContext = {
  symbol: BlockchainEnum.BASE_SEPOLIA,
  chainIdNumeric: 84532,
  isTestnet: true,
  explorer: 'https://base-sepolia.blockscout.com',
  standardRegistry: "0x843fa27dad1759f4a6d1a1f071b918866e821b23",
  accountImplementation: "0x9b069fff55acd8668225021e2142e432031cb0cd",
  relayExecutionStandard: '0xdc68651c7c98d6867b7e3be81377c266afa92892',
}