import { mergeContext, evaluate } from './mock_state';

describe('Record function test', () => {
  it('RECORD_ID', () => {
    expect(evaluate(
      'RECORD_ID()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('xyz');

    expect(evaluate(
      'RECORD_ID({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('xyz');
  });
});
