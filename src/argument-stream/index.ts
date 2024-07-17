import {EndOfStreamError} from '../errors';

/**
 * Represents the collection of command-line arguments along with a cursor to navigate the stream.
 */
export class ArgumentStream {
  private index = 0;

  get isAtEnd() {
    return this.index >= this.argv.length;
  }

  constructor(public readonly argv: string[]) {}

  peek(): string | undefined {
    if (this.isAtEnd) return undefined;
    return this.argv[this.index];
  }

  next(): string {
    const value = this.peek();
    if (!value) throw new EndOfStreamError();
    this.index++;
    return value;
  }
}
