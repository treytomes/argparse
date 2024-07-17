import {Argument} from '../argument';
import {ArgumentDescriptor} from '../argument-descriptor';
import {ArgumentStream} from '../argument-stream';

/**
 * Describe a single positional argument on the command-line.
 */
export abstract class PositionalArgumentDescriptor<
  T,
> extends ArgumentDescriptor<T> {}

export class StringPositionalArgumentDescriptor extends PositionalArgumentDescriptor<string> {
  constructor(key: string) {
    super(key);
  }

  canMatch(stream: ArgumentStream): boolean {
    return stream.peek() !== undefined;
  }

  match(stream: ArgumentStream): Argument<string> {
    if (!this.canMatch(stream)) throw new Error('Unable to match argument.');
    const value = stream.next();
    return new Argument<string>(this.key, value);
  }
}

export class NumericPositionalArgumentDescriptor extends PositionalArgumentDescriptor<number> {
  constructor(key: string) {
    super(key);
  }

  canMatch(stream: ArgumentStream): boolean {
    const value = stream.peek();
    if (!value) return false;
    return !isNaN(Number(value));
  }

  match(stream: ArgumentStream): Argument<number> {
    if (!this.canMatch(stream)) throw new Error('Unable to match argument.');
    const value = parseFloat(stream.next());
    return new Argument<number>(this.key, value);
  }
}

export class BooleanPositionalArgumentDescriptor extends PositionalArgumentDescriptor<boolean> {
  constructor(key: string) {
    super(key);
  }

  canMatch(stream: ArgumentStream): boolean {
    let value = stream.peek();
    if (!value) return false;
    value = value.trim().toLowerCase();
    return value === 'true' || value === 'false';
  }

  match(stream: ArgumentStream): Argument<boolean> {
    if (!this.canMatch(stream)) throw new Error('Unable to match argument.');
    const value = stream.next().toLowerCase() === 'true';
    return new Argument<boolean>(this.key, value);
  }
}
