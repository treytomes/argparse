import {Argument} from '../argument';
import {ArgumentStream} from '../argument-stream';
import {NotImplementedError} from '../errors/not-implemented-error';

export interface IArgumentDescriptor {
  canMatch(stream: ArgumentStream): boolean;
  match(stream: ArgumentStream): Argument<unknown>;
}

/**
 * Describe a single argument on the command-line.
 */
export abstract class ArgumentDescriptor<T> implements IArgumentDescriptor {
  constructor(public readonly key: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(stream: ArgumentStream): Argument<unknown> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canMatch(stream: ArgumentStream): boolean {
    throw new NotImplementedError('canMatch is not implemented.');
  }
}
