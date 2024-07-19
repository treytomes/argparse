export class EndOfStreamError extends Error {
  constructor(message?: string) {
    super(message ?? 'End of stream.');
    this.name = 'EndOfStreamError';
  }
}

export class ArgumentError extends Error {
  constructor(message?: string) {
    super(message ?? 'Argument error.');
    this.name = 'ArgumentError';
  }
}

export class NoArgumentsDefinedError extends ArgumentError {
  constructor(message?: string) {
    super(message ?? 'No arguments defined.');
    this.name = 'NoArgumentsDefinedError';
  }
}

export class NotImplementedError extends ArgumentError {
  constructor(message?: string) {
    super(message ?? 'Not implemented.');
    this.name = 'NotImplementedError';
  }
}

export class TooManyArgumentsError extends ArgumentError {
  constructor(message?: string) {
    super(message ?? 'Too many arguments.');
    this.name = 'TooManyArgumentsError';
  }
}

export class NotEnoughArgumentsError extends ArgumentError {
  constructor(message?: string) {
    super(message ?? 'Not enough arguments.');
    this.name = 'NotEnoughArgumentsError';
  }
}

export class ArgumentAlreadyDefinedError extends ArgumentError {
  constructor(
    public readonly argumentName: string,
    message?: string
  ) {
    super(message ?? `Argument already defined: ${argumentName}`);
    this.name = 'ArgumentAlreadyDefinedError';
  }
}

export class ArgumentNotDefinedError<
  T extends string | number,
> extends ArgumentError {
  constructor(
    public readonly argumentIdentifier: T,
    message?: string
  ) {
    super(
      message ?? `Argument not defined: ${JSON.stringify(argumentIdentifier)}`
    );
    this.name = 'ArgumentNotDefinedError';
  }
}
