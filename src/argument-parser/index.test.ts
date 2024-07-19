import 'reflect-metadata';
import {container} from 'tsyringe';
import {ArgumentParser} from '.';
import {
  NoArgumentsDefinedError,
  NotEnoughArgumentsError,
  TooManyArgumentsError,
} from '../errors';
import {Logger} from '../logger';

const mockLogger: Logger = {
  info: jest.fn(() => {}),
  error: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  warn: jest.fn(() => {}),
};

describe('Command-line arguments can be parsed and retrieved.', () => {
  beforeAll(() => {
    container.registerInstance('logger', mockLogger);
  });

  test('error when no arguments are defined', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB', 'textC'];
    const parser = container.resolve(ArgumentParser);
    expect(() => parser.parse(argv)).toThrow(new NoArgumentsDefinedError());
  });

  test('can parse a series of positional string arguments', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB', 'textC'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1');
    parser.addArgument('arg2');
    parser.addArgument('arg3');
    const args = parser.parse(argv);
    expect(args.get('arg1')).toBe('textA');
    expect(args.get('arg2')).toBe('textB');
    expect(args.get('arg3')).toBe('textC');
  });

  test('error when not enough arguments are provided', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1');
    parser.addArgument('arg2');
    parser.addArgument('arg3');
    expect(() => parser.parse(argv)).toThrow(new NotEnoughArgumentsError());
  });

  test('error when too many arguments are provided', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB', 'textC'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1');
    parser.addArgument('arg2');
    expect(() => parser.parse(argv)).toThrow(new TooManyArgumentsError());
  });
});
