import {IArgument} from './argument';

/**
 * A container for parsed arguments.
 */
export class Namespace {
  constructor(private args: IArgument[]) {}

  getValue<T>(key: string): T | undefined {
    return this.args.find(x => x.key === key)?.value as T;
  }
}
