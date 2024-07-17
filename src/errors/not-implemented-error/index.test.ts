import {NotImplementedError} from '.';

test('can throw not implemented error', () => {
  const err = new NotImplementedError('my message');
  expect(err).toBeDefined();
  expect(err.name).toBe('NotImplementedError');
  expect(err.message).toBe('my message');

  const testFn = () => {
    throw err;
  };
  expect(testFn).toThrow(NotImplementedError);

  expect(err).toBeInstanceOf(NotImplementedError);
  expect(err).toBeInstanceOf(Error);
});
