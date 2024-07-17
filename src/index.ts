import 'reflect-metadata';
import {Logger} from 'pino';
import {container, inject, injectable, singleton} from 'tsyringe';
import {config} from './config';
import {logger} from './logger';
import {profilerDecorator} from './profiler-decorator';

class Argument {
  constructor(
    public readonly key: string,
    public readonly value: string
  ) {}
}

class Namespace {
  constructor(private args: Argument[]) {}

  getValue(key: string): string | undefined {
    return this.args.find(x => x.key === key)?.value;
  }
}

class ArgumentDescriptor {
  constructor(
    public readonly names: string[],
    private readonly caseSensitive = true
  ) {}

  canMatch(text: string): boolean {
    if (this.caseSensitive) {
      return this.names.filter(x => x === text).length > 0;
    } else {
      text = text.toLowerCase();
      return this.names.filter(x => x.toLowerCase() === text).length > 0;
    }
  }
}

@injectable()
class ArgumentParser {
  private readonly args: ArgumentDescriptor[] = [];

  constructor(@inject('logger') private readonly logger: Logger) {}

  @profilerDecorator
  parse(argv: string[]): Namespace {
    // Index 0 is the `node.exe` path.
    // Index 1 is the path to the currently executing file.
    const textArgs = argv.slice(2);
    logger.debug({textArgs}, 'BEGIN PARSING');

    const args: Argument[] = [];

    let argvIndex = 0;
    while (argvIndex < textArgs.length) {
      // First check the named arguments.

      // Then check the positional arguments.
      if (textArgs[argvIndex].startsWith('--')) {
        const name = textArgs[argvIndex].slice(2);
        args.push(new Argument(name, ''));
        argvIndex++;
      } else {
        break;
      }
    }

    this.logger.debug('END PARSING');

    return new Namespace(args);
  }
}

@singleton()
class Program {
  constructor(@inject('logger') private readonly logger: Logger) {}

  @profilerDecorator
  main(argv: string[]) {
    this.logger.info('BEGIN');
    this.logger.debug({env: config.get('env'), debug: config.get('debug')});

    const parser = container.resolve(ArgumentParser);
    parser.parse(argv);

    this.logger.info('DONE');
  }
}

container.resolve(Program).main(process.argv);
