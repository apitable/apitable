import { mergeContext, evaluate } from './mock_state';

describe('Array function test', () => {
  it('ARRAYJOIN', () => {
    expect(evaluate(
      'ARRAYJOIN({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('第一, 第二');

    expect(evaluate(
      'ARRAYJOIN({d}, ";")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('第一;第二');
  });

  it('ARRAYUNIQUE', () => {
    expect(evaluate(
      'ARRAYUNIQUE({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['第一', '第二']);

    expect(evaluate(
      'ARRAYUNIQUE({b}, {d})',
      mergeContext({ a: 0, b: '第一', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['第一', '第二']);
  });

  it('ARRAYFLATTEN', () => {
    expect(evaluate(
      'ARRAYFLATTEN({d}, {d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual(['第一', '第二', '第一', '第二']);
  });
});
