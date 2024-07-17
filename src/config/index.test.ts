import {config} from '.';

test('can create default config', () => {
  expect(config.get('env')).toEqual('production');
  expect(config.get('debug')).toBeFalsy();
});
