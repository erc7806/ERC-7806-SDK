import { ethers, Signer } from "ethers";

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

  const header = isRelayerAssigned ? ethers.utils.solidityPack(
    ["uint64", "address"],
    [timestamp, relayerAddress]
  ) : ethers.utils.solidityPack(
    ["uint64"],
    [timestamp]
  )
  const relayInstructions = actions.map(action => {
    const encoded = encodeAction(action);
    return ethers.utils.solidityPack(
      ['uint16', 'bytes'],
      [encoded.length / 2 - 1, encoded]
    ).substring(2);
  });
  const encodedInstructions = ethers.utils.solidityPack(
    ["address", "uint128", "uint8", "bytes"],
    [paymentTokenAddress, paymentTokenAmount, actions.length, "0x" + relayInstructions.join('')]
  ).substring(2);

  const toSign = header + encodedInstructions;
  const intentHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address", "uint256"],
    [toSign, relayExecutionStandardAddress, chainId]
  ));

  const signature = await signer.signMessage(ethers.utils.arrayify(intentHash));

  return ethers.utils.solidityPack(
    ["address", "address", "uint16", "uint16", "uint16", "bytes", "bytes"],
    [signer.getAddress(), relayExecutionStandardAddress, headerLength, encodedInstructions.length / 2, signatureLength, toSign, signature]
  )
}