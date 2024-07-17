import {config} from './config';
import {logger} from './logger';
import {profilerDecorator} from './profiler-decorator';

class Argument {
  constructor(
    public readonly name: string,
    public readonly value: string
  ) {}
}

class Namespace {
  constructor(private args: Argument[]) {}

  getValue(key: string): string {
    return this.args.filter(x => x.name === key)[0].value;
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

class ArgumentParser {
  private readonly args: ArgumentDescriptor[] = [];

  constructor() {}

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

    logger.debug('END PARSING');

    return new Namespace(args);
  }
}

logger.info('BEGIN');

logger.debug({env: config.get('env'), debug: config.get('debug')});

const parser = new ArgumentParser();
parser.parse(process.argv);

logger.info('DONE');
