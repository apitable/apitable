import { mergeContext, evaluate } from './mock_state';

describe('Text function test', () => {
  it('FIND', () => {
    expect(evaluate(
      'FIND("智", {b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(7);

    expect(evaluate(
      'FIND({d}, {b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(5);

    expect(evaluate(
      'FIND({d}, {b}, {a})',
      mergeContext({ a: 3, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(5);

    expect(evaluate(
      'FIND({d}, {b}, {a})',
      mergeContext({ a: 7, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(0);

    expect(evaluate(
      'FIND({b}, {d})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(0);

    expect(() => evaluate(
      'FIND({b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('FIND 函数至少需要 2 个参数');

    expect(evaluate(
      'FIND("维", {b}, {a})',
      mergeContext({ a: -1, b: '欢迎加入维格智数，维格智数真棒', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(10);

    expect(evaluate(
      'FIND("维", {b}, {a})',
      mergeContext({ a: -7, b: '欢迎加入维格智数，维格智数真棒', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(5);

    expect(evaluate(
      'FIND("维", {b}, {a})',
      mergeContext({ a: -100, b: '欢迎加入维格智数，维格智数真棒', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(0);
  });

  it('SEARCH', () => {
    expect(evaluate(
      'SEARCH({d}, {b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(7);

    expect(evaluate(
      'SEARCH({d}, {b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(5);

    expect(evaluate(
      'SEARCH({d}, {b}, {a})',
      mergeContext({ a: 3, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(5);

    expect(evaluate(
      'SEARCH({d}, {b}, {a})',
      mergeContext({ a: 7, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt2'] }),
    )).toEqual(null);

    expect(evaluate(
      'SEARCH({b}, {d})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'SEARCH({b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('SEARCH 函数至少需要 2 个参数');
  });

  it('CONCATENATE', () => {
    expect(evaluate(
      'CONCATENATE({b}, {d})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数智');

    expect(evaluate(
      'CONCATENATE({a}, {b}, {c}, {d})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('0欢迎加入维格智数2020/06/06智');

    expect(() => evaluate(
      'CONCATENATE()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('CONCATENATE 函数至少需要 1 个参数');
  });

  it('ENCODE_URL_COMPONENT', () => {
    expect(evaluate(
      '"https://www.baidu.com/s?wd=" & ENCODE_URL_COMPONENT({b})',
      mergeContext({ a: 0, b: '维格表', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('https://www.baidu.com/s?wd=%E7%BB%B4%E6%A0%BC%E8%A1%A8');

    expect(() => evaluate(
      'ENCODE_URL_COMPONENT()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('ENCODE_URL_COMPONENT 函数至少需要 1 个参数');
  });

  it('LEFT', () => {
    expect(evaluate(
      'LEFT({b}, {a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'LEFT({b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢');

    expect(evaluate(
      'LEFT({b}, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加');

    expect(evaluate(
      'LEFT({b}, 3)',
      mergeContext({ a: 0, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(evaluate(
      'LEFT({b}, 33)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'LEFT({a})',
      mergeContext({ a: 2021, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('2');

    expect(evaluate(
      'LEFT({a}, 2)',
      mergeContext({ a: 2021, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('20');

    expect(() => evaluate(
      'LEFT()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('LEFT 函数至少需要 1 个参数');
  });

  it('RIGHT', () => {
    expect(evaluate(
      'RIGHT({b}, {a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'RIGHT({b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('数');

    expect(evaluate(
      'RIGHT({b}, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('格智数');

    expect(evaluate(
      'RIGHT({b}, 33)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'RIGHT({a})',
      mergeContext({ a: 2021, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('1');

    expect(evaluate(
      'RIGHT({a}, 2)',
      mergeContext({ a: 2021, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('21');

    expect(() => evaluate(
      'RIGHT()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('RIGHT 函数至少需要 1 个参数');
  });

  it('LEN', () => {
    expect(evaluate(
      'LEN({b}, {a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(8);

    expect(evaluate(
      'LEN(a)',
      mergeContext({ a: 100, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(3);

    expect(() => evaluate(
      'LEN()',
      mergeContext({ a: 100, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('LEN 函数至少需要 1 个参数');
  });

  it('LOWER', () => {
    expect(evaluate(
      'LOWER({b}, {a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'LOWER({b}, {a})',
      mergeContext({ a: 0, b: 'Welcome VIKADATA', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('welcome vikadata');

    expect(evaluate(
      'LOWER(a)',
      mergeContext({ a: 100, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('100');
  });

  it('UPPER', () => {
    expect(evaluate(
      'UPPER({b}, {a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'UPPER({b}, {a})',
      mergeContext({ a: 0, b: 'Welcome VIKADATA', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('WELCOME VIKADATA');

    expect(evaluate(
      'UPPER(a)',
      mergeContext({ a: 100, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('100');
  });

  it('MID', () => {
    expect(evaluate(
      'MID({b}, 5, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('维格智');

    expect(evaluate(
      'MID({b}, 5, 6)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('维格智数');

    expect(evaluate(
      'MID({b}, 55, 6)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'MID({a}, 5, 3)',
      mergeContext({ b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'MID({b}, 5)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('MID 函数至少需要 3 个参数');
  });

  it('REPLACE', () => {
    expect(evaluate(
      'REPLACE({b}, 5, 3, "go")',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入go数');

    expect(evaluate(
      'REPLACE({b}, 5, 3, a)',
      mergeContext({ b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入数');

    expect(evaluate(
      'REPLACE({b}, 35, 3, "go")',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数go');

    expect(evaluate(
      'REPLACE(3, 4, "这是一个错误的额参数", "已被替换")',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('3已被替换');

    expect(evaluate(
      'REPLACE({b}, 5, 33, "go")',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入go');

    expect(evaluate(
      'REPLACE({b}, 5, 33, "go")',
      mergeContext({ c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'REPLACE({b}, 5)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('REPLACE 函数至少需要 4 个参数');
  });

  it('T', () => {
    expect(evaluate(
      'T({a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(evaluate(
      'T({b})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'T({d})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('智');

    expect(() => evaluate(
      'T()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('T 函数至少需要 1 个参数');
  });

  it('TRIM', () => {
    expect(evaluate(
      'TRIM({a})',
      mergeContext({ a: 0, b: '  欢迎加入维格智数  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('0');

    expect(evaluate(
      'TRIM({b})',
      mergeContext({ a: 0, b: '  欢迎加入维格智数  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数');

    expect(evaluate(
      'TRIM({d})',
      mergeContext({ a: 0, b: '  欢迎加入维格智数  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('智');

    expect(() => evaluate(
      'TRIM()',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('TRIM 函数至少需要 1 个参数');
  });

  it('REPT', () => {
    expect(evaluate(
      'REPT({a}, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('000');

    expect(evaluate(
      'REPT({b}, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入维格智数欢迎加入维格智数欢迎加入维格智数');

    expect(evaluate(
      'REPT({d}, 3)',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('智智智');

    expect(() => evaluate(
      'REPT({a})',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('REPT 函数至少需要 2 个参数');
  });

  it('SUBSTITUTE', () => {
    expect(evaluate(
      'SUBSTITUTE({b}, "小", "老")',
      mergeContext({ a: 0, b: '小胡，小张，小王', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('老胡，老张，老王');

    expect(evaluate(
      'SUBSTITUTE({b}, "小", "老", 2)',
      mergeContext({ a: 0, b: '小胡，小张，小王', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('小胡，老张，小王');

    expect(evaluate(
      'SUBSTITUTE({b}, "小", "老", 4)',
      mergeContext({ a: 0, b: '小胡，小张，小王', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('小胡，小张，小王');

    expect(evaluate(
      'SUBSTITUTE({b}, "小", "老", -1)',
      mergeContext({ a: 0, b: '小胡，小张，小王', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('小胡，小张，小王');

    expect(() => evaluate(
      'SUBSTITUTE({b}, "维格")',
      mergeContext({ a: 0, b: '欢迎加入维格智数', c: 1591414562369, d: ['opt1'] }),
    )).toThrow('SUBSTITUTE 函数至少需要 3 个参数');
  });

});
