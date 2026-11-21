import { InvalidArgumentError } from "../errors.js";
import { decodeCheck } from "./decode.js";
import { encodeCheck } from "./encode.js";
import { StrKey } from "./types.js";

export { StrKey } from "./types.js";
export { encodeCheck } from "./encode.js";
export { decodeCheck } from "./decode.js";

/**
 * Extract the 64-bit subaccount ID from a Med25519 (M-address) strkey.
 *
 * Muxed addresses encode a 64-bit subaccount ID in the payload following the
 * 32-byte ed25519 public key. This helper decodes the address and returns that
 * subaccount ID as a `bigint`.
 *
 * @param address - A valid Med25519 (M-address) strkey.
 * @returns The 64-bit subaccount ID encoded in the address.
 * @throws {InvalidArgumentError} If the address is not a valid Med25519 address
 *   (for example, a standard G-address or a C-address).
 *
 * @example
 * ```ts
 * import { getMuxedSubaccountId } from "@stellar/stellar-base";
 *
 * const id = getMuxedSubaccountId("MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK");
 * // 0n
 * ```
 */
export function getMuxedSubaccountId(address: string): bigint {
  if (!StrKey.isValidMed25519PublicKey(address)) {
    throw new InvalidArgumentError(
      "address is not a valid Med25519 (M-address) strkey",
    );
  }

  const raw = decodeCheck(StrKey.ed25519PublicKey, address);
  // Payload layout: 32-byte ed25519 key followed by 8-byte big-endian subaccount ID.
  let subaccountId = 0n;
  for (let i = 32; i < 40; i++) {
    subaccountId = (subaccountId << 8n) | BigInt(raw[i]);
  }
  return subaccountId;
}
