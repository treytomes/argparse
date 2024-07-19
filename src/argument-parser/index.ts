import {Logger} from 'pino';
import {inject, injectable} from 'tsyringe';
import {
  NoArgumentsDefinedError,
  NotEnoughArgumentsError,
  TooManyArgumentsError,
} from '../errors';
import {profilerDecorator} from '../profiler-decorator';

class Arguments {
  private args: Map<string, string> = new Map();

  has(key: string) {
    return this.args.has(key);
  }

  get(key: string) {
    return this.args.get(key);
  }

  set(key: string, value: string) {
    this.args.set(key, value);
  }
}

@injectable()
export class ArgumentParser {
  argKeys: string[] = [];

  constructor(@inject('logger') private readonly logger: Logger) {}

  addArgument(key: string) {
    this.logger.info(`Add argument: ${key}`);
    this.argKeys.push(key);
  }

  @profilerDecorator
  parse(argv: string[]): Arguments {
    if (this.argKeys.length === 0) throw new NoArgumentsDefinedError();

    // Argument 1 is the path to node.exe.
    // Argument 2 is the path to the currently executing file.
    argv = argv.slice(2);

    if (argv.length > this.argKeys.length) throw new TooManyArgumentsError();
    if (argv.length < this.argKeys.length) throw new NotEnoughArgumentsError();

    const args = new Arguments();

    for (let n = 0; n < argv.length; n++) {
      const arg = this.argKeys[n];
      this.logger.info(`Set argument: ${arg} = ${argv[n]}`);
      args.set(arg, argv[n]);
    }

    return args;
  }
}
