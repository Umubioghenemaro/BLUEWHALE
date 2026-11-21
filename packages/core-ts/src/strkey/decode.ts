import { StrKey } from "./strkey";
import { crc16Xmodem } from "./crc16";

/**
 * Matches leading/trailing ASCII whitespace and zero-width spaces that users
 * commonly introduce when copy-pasting addresses.
 */
const TRIMMABLE_EDGE_CHARS = /^[\t\n\v\f\r \u200B]+|[\t\n\v\f\r \u200B]+$/g;

/**
 * Matches non-printable characters (control chars, zero-width spaces, etc.)
 * that must not appear inside the address body.
 */
const NON_PRINTABLE_CHARS = /[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/;

/**
 * Normalizes a raw address string by stripping leading/trailing ASCII
 * whitespace and zero-width spaces, then rejects any non-printable characters
 * embedded within the address body.
 *
 * @param address - the raw address string, possibly with surrounding whitespace
 * @returns the sanitized address string
 * @throws {Error} if non-printable characters are embedded within the body
 */
export function sanitizeAddress(address: string): string {
  const trimmed = address.replace(TRIMMABLE_EDGE_CHARS, "");

  if (NON_PRINTABLE_CHARS.test(trimmed)) {
    throw new Error("Address contains non-printable characters");
  }

  return trimmed;
}

/**
 * Decodes a strkey-encoded address into its raw bytes.
 *
 * @param address - the strkey address to decode
 * @returns the decoded payload bytes
 */
export function decode(address: string): Buffer {
  const sanitized = sanitizeAddress(address);
  return StrKey.decode(sanitized);
}
