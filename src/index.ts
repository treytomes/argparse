import {Logger} from 'pino';
import 'reflect-metadata';
import {container, inject, singleton} from 'tsyringe';
import {ArgumentParser} from './argument-parser';
import {config} from './config';
import {profilerDecorator} from './profiler-decorator';

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
