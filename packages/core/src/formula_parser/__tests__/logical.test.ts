import { mergeContext, evaluate } from './mock_state';

describe('Logical function test', () => {
  it('IF', () => {
    expect(evaluate(
      'IF(0, 1, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(2);
    expect(evaluate(
      'IF(1, 1, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(1);
    expect(evaluate(
      'IF(IF({a}, 1, 0), 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(3);
    // requires at least 3 parameters
    expect(() => evaluate(
      'IF("x")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('IF 函数需要 3 个参数');
  });

  it('BLANK', () => {
    expect(evaluate(
      'BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);

    expect(evaluate(
      'BLANK() + BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(0);

    expect(evaluate(
      '1 + BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(1);

    expect(evaluate(
      'BLANK({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);
  });

  it('TRUE', () => {
    expect(evaluate(
      'TRUE()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'TRUE({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);
  });

  it('FALSE', () => {
    expect(evaluate(
      'FALSE()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'FALSE({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);
  });

  it('OR', () => {
    expect(evaluate(
      'OR({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'OR({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'OR({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(() => evaluate(
      'OR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('OR 函数至少需要 1 个参数');
  });

  it('AND', () => {
    expect(evaluate(
      'AND({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'AND({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'AND({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'AND()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('AND 函数至少需要 1 个参数');
  });

  it('XOR', () => {
    expect(evaluate(
      'XOR({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'XOR({a}, {b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'XOR({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'XOR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('XOR 函数至少需要 1 个参数');
  });

  it('NOT', () => {
    expect(evaluate(
      'NOT({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'NOT({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'NOT()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('NOT 函数需要 1 个参数');
  });

  it('SWITCH', () => {
    expect(evaluate(
      'SWITCH({b}, "一二三")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('一二三');

    expect(evaluate(
      'SWITCH({a}, "123", "一二三", "456", "四五六", "七八九")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('七八九');

    expect(evaluate(
      'SWITCH({b}, "123", "一二三", "456", "四五六", "七八九")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('四五六');

    expect(evaluate(
      'SWITCH({a}, "123", "一二三", "456", "四五六")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'SWITCH({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('SWITCH 函数至少需要 2 个参数');
  });

  // it('ERROR', () => {
  //   expect(evaluate(
  //     'ERROR()',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR({a})',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR("")',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR({b})',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error: 456');
  // });

  it('ISERROR', () => {
    expect(evaluate(
      'ISERROR({a}/{a})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({b}/{a})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({a}/{b})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({b}/{b})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({a}/1)',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'ISERROR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow('IS_ERROR 函数需要 1 个参数');
  });
});
