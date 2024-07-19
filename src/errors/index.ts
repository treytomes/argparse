export class EndOfStreamError extends Error {
  constructor(message?: string) {
    super(message ?? 'End of stream.');
    this.name = 'EndOfStreamError';
  }
}

export class NoArgumentsDefinedError extends Error {
  constructor(message?: string) {
    super(message ?? 'No arguments defined.');
    this.name = 'NoArgumentsDefinedError';
  }
}

export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Not implemented.');
    this.name = 'NotImplementedError';
  }
}

export class TooManyArgumentsError extends Error {
  constructor(message?: string) {
    super(message ?? 'Too many arguments.');
    this.name = 'TooManyArgumentsError';
  }
}

export class NotEnoughArgumentsError extends Error {
  constructor(message?: string) {
    super(message ?? 'Not enough arguments.');
    this.name = 'NotEnoughArgumentsError';
  }
}
