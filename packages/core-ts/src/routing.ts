/**
 * Routing helpers for resolving deposit destinations.
 */

export type DepositDestinationKind = 'classic' | 'muxed' | 'contract';

export interface ClassicDepositDestination {
  kind: 'classic';
  /** The classic account address (G...). */
  address: string;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  account: string;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  muxed: undefined;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  contract: undefined;
}

export interface MuxedDepositDestination {
  kind: 'muxed';
  /** The muxed account address (M...). */
  address: string;
  /** The underlying classic account address (G...). */
  account: string;
  /** The muxed account id, if present. */
  muxedId?: string;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  muxed: string;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  contract: undefined;
}

export interface ContractDepositDestination {
  kind: 'contract';
  /** The contract address (C...). */
  address: string;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  account: undefined;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  muxed: undefined;
  /** @deprecated Use `kind` to discriminate. Retained for backward compatibility. */
  contract: string;
}

export type DepositDestination =
  | ClassicDepositDestination
  | MuxedDepositDestination
  | ContractDepositDestination;

/**
 * Parse a deposit destination string into a discriminated union.
 *
 * @deprecated The legacy nullable-property access pattern (`account`/`muxed`/`contract`)
 * is deprecated. Discriminate on `kind` instead.
 */
export function parseDepositDestination(
  destination: string,
): DepositDestination {
  const value = destination.trim();

  if (value.startsWith('M')) {
    return {
      kind: 'muxed',
      address: value,
      account: value,
      muxed: value,
      contract: undefined,
    };
  }

  if (value.startsWith('C')) {
    return {
      kind: 'contract',
      address: value,
      account: undefined,
      muxed: undefined,
      contract: value,
    };
  }

  return {
    kind: 'classic',
    address: value,
    account: value,
    muxed: undefined,
    contract: undefined,
  };
}
