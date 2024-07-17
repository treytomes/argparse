import {ArgumentDescriptor} from '../argument-descriptor';
import {ArgumentStream} from '../argument-stream';

/**
 * Describe a single named argument on the command-line.
 */
export class NamedArgumentDescriptor<T> extends ArgumentDescriptor<T> {
  constructor(
    key: string,
    public readonly names: string[],
    public readonly caseSensitive = true
  ) {
    super(key);
  }

  canMatch(stream: ArgumentStream): boolean {
    let value = stream.peek();
    if (!value) return false;

    if (this.caseSensitive) {
      return this.names.filter(x => x === value).length > 0;
    } else {
      value = value.toLowerCase();
      return this.names.filter(x => x.toLowerCase() === value).length > 0;
    }
  }
}
