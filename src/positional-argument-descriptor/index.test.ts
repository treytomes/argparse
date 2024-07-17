import {StringPositionalArgumentDescriptor} from '.';
import {ArgumentStream} from '../argument-stream';

/**
 * The simplest argument is a positional string.
 */
test('can define simple argument', () => {
  const arg = new StringPositionalArgumentDescriptor('filename');

  const argv = ['file.txt'];
  const stream = new ArgumentStream(argv);
  expect(arg.canMatch(stream)).toBeTruthy();
  expect(arg.match(stream)).toEqual('file.txt');
});
