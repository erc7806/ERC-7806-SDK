import { 
  Signer,
  AbiCoder,
  solidityPacked,
  keccak256,
  getBytes
} from "ethers";

import { encodeAction } from "./action";
import { Action } from "../types/action";

export const buildRelayExecutionIntent = async (
  chainId: number,
  relayExecutionStandardAddress: string,
  paymentTokenAddress: string,
  paymentTokenAmount: bigint,
  actions: Action[],
  expiration: number,
  signer: Signer,
  relayerAddress?: string
): Promise<string> => {
  const isRelayerAssigned = relayerAddress && relayerAddress !== "0x0000000000000000000000000000000000000000";
  const headerLength = isRelayerAssigned ? 28 : 8;
  const timestamp = Math.floor(Date.now() / 1000) + expiration * 60;
  const signatureLength = 65;

  // Create header with timestamp and optional relayer
  const header = isRelayerAssigned ? 
    solidityPacked(
      ["uint64", "address"],
      [timestamp, relayerAddress]
    ) : 
    solidityPacked(
      ["uint64"],
      [timestamp]
    );

  // Encode relay instructions
  const relayInstructions = actions.map(action => {
    const encoded = encodeAction(action);
    return solidityPacked(
      ['uint16', 'bytes'],
      [encoded.length / 2 - 1, encoded]
    ).substring(2);
  });

  const encodedInstructions = solidityPacked(
    ["address", "uint128", "uint8", "bytes"],
    [paymentTokenAddress, paymentTokenAmount, actions.length, "0x" + relayInstructions.join('')]
  ).substring(2);

  const toSign = header + encodedInstructions;
  const intentHash = keccak256(new AbiCoder().encode(
    ["bytes", "address", "uint256"],
    [toSign, relayExecutionStandardAddress, chainId]
  ));

  const signature = await signer.signMessage(getBytes(intentHash));

  return solidityPacked(
    ["address", "address", "uint16", "uint16", "uint16", "bytes", "bytes"],
    [await signer.getAddress(), relayExecutionStandardAddress, headerLength, encodedInstructions.length / 2, signatureLength, toSign, signature]
  );
}