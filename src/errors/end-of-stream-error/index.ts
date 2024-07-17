export class EndOfStreamError extends Error {
  constructor(message?: string) {
    super(message ?? 'End of stream.');
    this.name = 'EndOfStreamError';
  }
}
