import pino from 'pino';
import {container} from 'tsyringe';
import {config} from '../config';

type LogFunction = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends object>(obj: T, msg?: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj: unknown, msg?: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (msg: string, ...args: any[]): void;
};

export type Logger = {
  info: LogFunction;
  error: LogFunction;
  debug: LogFunction;
  warn: LogFunction;
};

export const logger: Logger = pino({
  level: config.get('debug') ? 'debug' : 'info',
});

container.registerInstance('logger', logger);
