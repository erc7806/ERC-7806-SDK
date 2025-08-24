import { Signer, solidityPacked, ethers } from "ethers";
import { Action } from "../types/action";
import { encodeAction } from "./action";

// Define the domain and type
const getDomain = (
  chainId: number,
  relayExecutionStandardAddress: string,
) => {
  return {
    name: "RelayedExecutionStandard",
    version: "0.1.0",
    chainId: chainId,
    verifyingContract: relayExecutionStandardAddress
  };
};

const types = {
  Intent: [
    { name: "expiration", type: "uint64" },
    { name: "relayer", type: "address" },
    { name: "paymentToken", type: "address" },
    { name: "paymentAmount", type: "uint128" },
    { name: "instructions", type: "bytes[]" },
  ]
};

export const buildRelayExecutionIntent = async (
  chainId: number,
  relayExecutionStandardAddress: string,
  paymentTokenAddress: string,
  paymentTokenAmount: bigint,
  actions: Action[],
  expiration: number,
  signer: Signer,
  relayerAddress: string
): Promise<string> => {
  const timestamp = Math.floor(Date.now() / 1000) + expiration * 60;

  // header
  const header = solidityPacked(
    ["uint64", "address", "address", "uint128"],
    [timestamp, relayerAddress, paymentTokenAddress, paymentTokenAmount]
  )

  // instructions
  const encodedInstructions = actions.map(action => encodeAction(action));
  const instructions = solidityPacked(
    ["uint8", "bytes"],
    [actions.length, "0x" + encodedInstructions.map(instruction => solidityPacked(["uint16", "bytes"], [instruction.length / 2 - 1, instruction]).substring(2)).join('')]
  );

  // signature
  const domain = getDomain(chainId, relayExecutionStandardAddress);
  const value = {
    expiration: timestamp,
    relayer: relayerAddress,
    paymentToken: paymentTokenAddress,
    paymentAmount: paymentTokenAmount,
    instructions: encodedInstructions,
  };
  const signature = await signer.signTypedData(domain, types, value);

  return ethers.solidityPacked(
    ["address", "address", "uint16", "uint16", "uint16", "bytes", "bytes","bytes"],
    [await signer.getAddress(), relayExecutionStandardAddress, 64, instructions.length / 2 - 1, 65, header, instructions, signature]
  )
}
