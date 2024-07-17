export interface IArgument {
  key: string;
  value: unknown;
}

/**
 * Represent a single command-line argument.
 *
 * The key is not necessarily the same as the argument name used on the command-line.
 * e.g. The "-h" and "--help" argument names could both be tied to the "help" key.
 */
export class Argument<T> implements IArgument {
  constructor(
    public readonly key: string,
    public readonly value: T
  ) {}
}
