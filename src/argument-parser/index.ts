import {Logger} from 'pino';
import {inject, injectable} from 'tsyringe';
import {
  ArgumentAlreadyDefinedError,
  ArgumentError,
  ArgumentNotDefinedError,
  NoArgumentsDefinedError,
  NotEnoughArgumentsError,
  TooManyArgumentsError,
} from '../errors';
import {profilerDecorator} from '../profiler-decorator';

type RequiredArgumentProps = {
  required: true;
};

type OptionalArgumentProps = {
  required: false;
  defaultValue?: string;
};

type ArgumentProps = RequiredArgumentProps | OptionalArgumentProps;

type ArgumentInfo = ArgumentProps & {
  key: string;
  identifier: number | string[];
};

class Arguments {
  private args: Map<string, string | undefined> = new Map();

  has(key: string) {
    return this.args.has(key);
  }

  get(key: string) {
    if (!this.has(key)) throw new ArgumentNotDefinedError(key);
    return this.args.get(key);
  }

  set(key: string, value: string | undefined) {
    this.args.set(key, value);
  }
}

@injectable()
export class ArgumentParser {
  private args: ArgumentInfo[] = [];

  constructor(@inject('logger') private readonly logger: Logger) {}

  getArgument(key: string) {
    const arg = this.args.find(x => x.key === key);
    if (!arg) throw new ArgumentNotDefinedError(key);
    return arg;
  }

  addArgument(
    key: string,
    props: ArgumentProps = {
      required: true,
    }
  ): ArgumentInfo {
    this.logger.debug(`Add argument: ${key}`);

    if (this.args.find(x => x.key === key)) {
      throw new ArgumentAlreadyDefinedError(key);
    }

    if (props.required && this.args.find(x => !x.required)) {
      throw new ArgumentError(
        'Required arguments cannot be defined after optional arguments.'
      );
    }

    const arg = {
      ...props,
      key,
      identifier: this.args.length,
    };
    this.args.push(arg);
    return arg;
  }

  @profilerDecorator
  parse(argv: string[]): Arguments {
    if (this.args.length === 0) throw new NoArgumentsDefinedError();

    // Argument 1 is the path to node.exe.
    // Argument 2 is the path to the currently executing file.
    argv = argv.slice(2);

    if (argv.length > this.args.length) throw new TooManyArgumentsError();
    if (argv.length < this.args.filter(x => x.required).length) {
      throw new NotEnoughArgumentsError();
    }

    const args = new Arguments();

    for (let n = 0; n < argv.length; n++) {
      const arg = this.args.find(x => x.identifier === n);
      if (!arg) throw new ArgumentNotDefinedError(n);
      this.logger.info(`Set argument: ${arg.key} = ${argv[n]}`);
      args.set(arg.key, argv[n]);
    }

    // Define any arguments that are optional, but were not passed in through the command-line.
    this.args
      .filter(x => !x.required && !args.has(x.key))
      .forEach(x => args.set(x.key, undefined));

    return args;
  }
}
