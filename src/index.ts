import {Logger} from 'pino';
import 'reflect-metadata';
import {container, inject, injectable, singleton} from 'tsyringe';
import {Argument, IArgument} from './argument';
import {IArgumentDescriptor} from './argument-descriptor';
import {config} from './config';
import {logger} from './logger';
import {Namespace} from './namespace';
import {profilerDecorator} from './profiler-decorator';

@injectable()
class ArgumentParser {
  private readonly args: IArgumentDescriptor[] = [];

  constructor(@inject('logger') private readonly logger: Logger) {}

  @profilerDecorator
  parse(argv: string[]): Namespace {
    // Index 0 is the `node.exe` path.
    // Index 1 is the path to the currently executing file.
    const textArgs = argv.slice(2);
    logger.debug({textArgs}, 'BEGIN PARSING');

    const args: IArgument[] = [];

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
