import convict from 'convict';

export const config = convict({
  debug: {
    doc: 'Is the app currently being debugged?',
    format: [true, false],
    default: process.env.DEBUG === 'true',
  },
  env: {
    doc: 'The type of execution environment.',
    format: ['development', 'production'],
    default: process.env.ENV ?? 'production',
  },
}).validate({allowed: 'strict'});
