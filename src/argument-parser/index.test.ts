import 'reflect-metadata';
import {container} from 'tsyringe';
import {ArgumentParser} from '.';
import {
  ArgumentAlreadyDefinedError,
  ArgumentError,
  ArgumentNotDefinedError,
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

  test('arguments cannot be redefined', () => {
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1');
    expect(() => parser.addArgument('arg1')).toThrow(
      new ArgumentAlreadyDefinedError('arg1')
    );
  });

  test('cannot get an argument if it is not defined', () => {
    const parser = container.resolve(ArgumentParser);
    expect(() => parser.getArgument('arg1')).toThrow(
      new ArgumentNotDefinedError('arg1')
    );
  });

  test('arguments can be marked as required or optional', () => {
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: false});

    expect(parser.getArgument('arg1').required).toBeTruthy();
    expect(parser.getArgument('arg2').required).toBeFalsy();
  });

  test('optional positional arguments can be defined last', () => {
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: false});
  });

  test('optional positional arguments cannot be defined before required arguments', () => {
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: false});
    expect(() => parser.addArgument('arg3', {required: true})).toThrow(
      new ArgumentError(
        'Required arguments cannot be defined after optional arguments.'
      )
    );
  });

  test('can parse all optional positional arguments', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB', 'textC'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: false});
    parser.addArgument('arg2', {required: false});
    parser.addArgument('arg3', {required: false});
    const args = parser.parse(argv);
    expect(args.get('arg1')).toBe('textA');
    expect(args.get('arg2')).toBe('textB');
    expect(args.get('arg3')).toBe('textC');
  });

  test('can parse some mixed optional / required positional arguments', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB', 'textC'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: true});
    parser.addArgument('arg3', {required: false});
    const args = parser.parse(argv);
    expect(args.get('arg1')).toBe('textA');
    expect(args.get('arg2')).toBe('textB');
    expect(args.get('arg3')).toBe('textC');
  });

  test('missing optional arguments should be undefined', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: false});
    parser.addArgument('arg3', {required: false});
    const args = parser.parse(argv);
    expect(args.get('arg1')).toBe('textA');
    expect(args.get('arg2')).toBe('textB');
    expect(args.get('arg3')).toBe(undefined);
  });

  test('cannot retrieve undefined arguments', () => {
    const argv = ['node.exe', 'test.ts', 'textA', 'textB'];
    const parser = container.resolve(ArgumentParser);
    parser.addArgument('arg1', {required: true});
    parser.addArgument('arg2', {required: false});
    parser.addArgument('arg3', {required: false});
    const args = parser.parse(argv);
    expect(() => args.get('arg4')).toThrow(new ArgumentNotDefinedError('arg4'));
  });

  test('the default default value for optional arguments is undefined', () => {
    const parser = container.resolve(ArgumentParser);
    const arg = parser.addArgument('arg1', {required: false});
    if (!arg.required) {
      expect(arg.defaultValue).toBe(undefined);
    } else {
      expect(arg.required).toBeFalsy();
    }
  });

  test('optional arguments can have default values', () => {
    const parser = container.resolve(ArgumentParser);
    const arg = parser.addArgument('arg1', {
      required: false,
      defaultValue: 'default',
    });
    if (!arg.required) {
      expect(arg.defaultValue).toBe('default');
    } else {
      expect(arg.required).toBeFalsy();
    }
  });

  test('required arguments cannot have default values', () => {
    const parser = container.resolve(ArgumentParser);
    const arg = parser.addArgument('arg1', {
      required: true,
    });
    expect(arg.required).toBeTruthy();
    // You couldn't set the defaultValue on this arg if you wanted to.  Thanks TypeScript!
  });

  // arguments cannot share identifiers
  // TODO: Only matters with named arguments.
});
