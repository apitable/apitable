import { mergeContext, evaluate } from './mock_state';

describe('Array function test', () => {
  it('ARRAYJOIN', () => {
    expect(evaluate(
      'ARRAYJOIN({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('the first, the second');

    expect(evaluate(
      'ARRAYJOIN({d}, ";")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('the first;the second');
  });

  it('ARRAYUNIQUE', () => {
    expect(evaluate(
      'ARRAYUNIQUE({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['the first', 'the second']);

    expect(evaluate(
      'ARRAYUNIQUE({b}, {d})',
      mergeContext({ a: 0, b: 'the first', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['the first', 'the second']);
  });

  it('ARRAYFLATTEN', () => {
    expect(evaluate(
      'ARRAYFLATTEN({d}, {d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual(['the first', 'the second', 'the first', 'the second']);
  });
});
