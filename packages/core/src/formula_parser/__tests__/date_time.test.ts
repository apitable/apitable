/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import dayjs from 'dayjs';
import { getDayjs } from '../functions/date_time';
import { evaluate, mergeContext } from './mock_state';
import { ParamsCountError } from '../errors/params_count.error';
import { UnitError } from 'formula_parser/errors/unit.error';

describe('DateTime function test', () => {
  it('DAY', () => {
    expect(evaluate('DAY({c})', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(6);
    // support parsing string type
    expect(
      evaluate(
        'DAY({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(3);
    expect(evaluate('DAY({b})', mergeContext({ a: 0, b: '2012年2月3日', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(3);
    // ignore redundant parameters
    expect(evaluate('DAY({c}, {a})', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(6);
    // requires at least one parameter
    expect(() => evaluate('DAY()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('YEAR', () => {
    expect(evaluate('YEAR({c})', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(2020);
    // support parsing string type
    expect(
      evaluate(
        'YEAR({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(2012);
    // requires at least one parameter
    expect(() => evaluate('YEAR()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('MONTH', () => {
    expect(evaluate('MONTH({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }))).toEqual(6);
    // support parsing string type
    expect(
      evaluate(
        'MONTH({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(2);
    // requires at least one parameter
    expect(() => evaluate('MONTH()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('HOUR', () => {
    expect(evaluate('HOUR({c})', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(11);
    // support parsing string type
    expect(
      evaluate(
        'HOUR({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(23);
    // requires at least one parameter
    expect(() => evaluate('HOUR()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('MINUTE', () => {
    expect(evaluate('MINUTE({c})', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toEqual(36);
    // support parsing string type
    expect(
      evaluate(
        'MINUTE({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(22);
    // requires at least one parameter
    expect(() => evaluate('MINUTE()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('SECOND', () => {
    expect(evaluate('SECOND({c})', mergeContext({ c: new Date('2020/6/10 00:00:02').getTime() }))).toEqual(2);
    // support parsing string type
    expect(
      evaluate(
        'SECOND({b})',
        // tslint:disable-next-line: max-line-length
        mergeContext({ a: 0, b: '2012/2/3 23:22:44', c: 1591414562369, d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(44);
    // requires at least one parameter
    expect(() => evaluate('SECOND()', mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);
  });

  it('WEEKDAY', () => {
    expect(evaluate('WEEKDAY({c})', mergeContext({ c: new Date('2020/6/10 00:00:00').getTime() }))).toEqual(3);

    expect(evaluate('WEEKDAY({c}, "Monday")', mergeContext({ c: new Date('2020/6/10 00:00:00').getTime() }))).toEqual(2);

    expect(evaluate('WEEKDAY({c}, "Sunday")', mergeContext({ c: new Date('2020/6/10 00:00:00').getTime() }))).toEqual(3);

    // requires at least one parameter
    expect(() => evaluate('WEEKDAY()', mergeContext({ c: new Date('2020/6/10 00:00:00').getTime() }))).toThrow(ParamsCountError);
  });

  it('DATEADD', () => {
    expect(evaluate('DATEADD({c}, 1, "years")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2021/6/6 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 1.5, "years")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2021/6/6 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 3, "quarters")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2021/3/6 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 3, "months")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/9/6 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 3, "weeks")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/6/27 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 100, "days")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/9/14 00:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 100, "hours")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/6/10 04:00:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 100, "minutes")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/6/6 01:40:00').getTime(),
    );

    expect(evaluate('DATEADD({c}, 100, "seconds")', mergeContext({ c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/6/6 00:01:40').getTime(),
    );

    expect(evaluate('DATEADD({c}, 100000, {b})', mergeContext({ b: 'milliseconds', c: new Date('2020/6/6 00:00:00').getTime() }))).toEqual(
      new Date('2020/6/6 00:01:40').getTime(),
    );

    // requires at least 3 parameters
    expect(() => evaluate('DATEADD()', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);

    expect(() => evaluate('DATEADD(c, 10, "x")', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toThrow(UnitError);
  });

  it('DATETIME_DIFF', () => {
    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "y")',
        mergeContext({ c: new Date('2020/6/6 00:00:00').getTime(), e: new Date('2022/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(-2);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "Q")',
        mergeContext({ c: new Date('2020/12/5 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(1.988888888888889);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "M")',
        mergeContext({ c: new Date('2020/6/6 00:00:00').getTime(), e: new Date('2020/9/6 00:00:00').getTime() }),
      ),
    ).toEqual(-3);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "w")',
        mergeContext({ c: new Date('2020/12/5 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(26);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "d")',
        mergeContext({ c: new Date('2020/12/6 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(183);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "h")',
        mergeContext({ c: new Date('2020/12/6 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(4392);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "m")',
        mergeContext({ c: new Date('2020/12/6 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(263520);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "s")',
        mergeContext({ c: new Date('2020/12/6 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(15811200);

    expect(
      evaluate(
        'DATETIME_DIFF({c}, {e}, "ms")',
        mergeContext({ c: new Date('2020/12/6 00:00:00').getTime(), e: new Date('2020/6/6 00:00:00').getTime() }),
      ),
    ).toEqual(15811200000);

    // requires at least 3 parameters
    expect(() => evaluate('DATETIME_DIFF()', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toThrow(ParamsCountError);

    expect(() => evaluate('DATETIME_DIFF(c, c, "x")', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toThrow(UnitError);
  });

  it('TODAY', () => {
    expect(evaluate('TODAY()', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toEqual(new Date().setHours(0, 0, 0, 0));

    expect(evaluate('TODAY(a)', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toEqual(new Date().setHours(0, 0, 0, 0));

    expect(evaluate('TODAY(b)', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toEqual(new Date().setHours(0, 0, 0, 0));

    expect(evaluate('TODAY(c)', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toEqual(new Date().setHours(0, 0, 0, 0));

    expect(evaluate('TODAY(d)', mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }))).toEqual(new Date().setHours(0, 0, 0, 0));
  });

  // it('NOW', () => {
  //   expect(evaluate(
  //     'NOW()',
  //     mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }),
  //   )).toEqual(Date.now());

  //   expect(evaluate(
  //     'NOW(a)',
  //     mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }),
  //   )).toEqual(Date.now());

  //   expect(evaluate(
  //     'NOW(b)',
  //     mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }),
  //   )).toEqual(Date.now());

  //   expect(evaluate(
  //     'NOW(c)',
  //     mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }),
  //   )).toEqual(Date.now());

  //   expect(evaluate(
  //     'NOW(d)',
  //     mergeContext({ a: 0, b: '456', c: 1592236800000, d: ['opt1', 'opt2'] }),
  //   )).toEqual(Date.now());
  // });

  it('FROMNOW', () => {
    // expect(evaluate(
    //   'FROMNOW({c}, "d")',
    //   mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] }),
    // )).toEqual(4);

    expect(
      evaluate(
        'FROMNOW({c}, "M")',
        mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(1);

    expect(() =>
      evaluate(
        'FROMNOW({c})',
        mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toThrow(ParamsCountError);
  });

  it('TONOW', () => {
    // expect(evaluate(
    //   'TONOW({c}, "d")',
    //   mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] }),
    // )).toEqual(5);

    expect(
      evaluate(
        'TONOW({c}, "M")',
        mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(1);

    expect(() =>
      evaluate('TONOW({c})', mergeContext({ a: 0, b: '456', c: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 1).getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow(ParamsCountError);
  });

  it('IS_BEFORE', () => {
    expect(
      evaluate('IS_BEFORE({c}, NOW())', mergeContext({ a: 0, b: '456', c: new Date('2100/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(false);

    expect(
      evaluate('IS_BEFORE({c}, NOW())', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(true);

    expect(() =>
      evaluate('IS_BEFORE({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow(ParamsCountError);
  });

  it('IS_AFTER', () => {
    expect(
      evaluate('IS_AFTER({c}, NOW())', mergeContext({ a: 0, b: '456', c: new Date('2100/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(true);

    expect(
      evaluate('IS_AFTER({c}, NOW())', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(false);

    expect(() =>
      evaluate('IS_AFTER({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow(ParamsCountError);
  });

  it('WORKDAY', () => {
    expect(evaluate('WORKDAY({c}, 100)', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }))).toEqual(
      1603382400000,
    );

    expect(
      evaluate('WORKDAY({c}, 100, "2020-07-13")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(1603641600000);

    expect(
      evaluate(
        'WORKDAY({c}, 100, "2020-07-13, 2020-07-14")',
        mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(1603728000000);

    expect(
      evaluate('WORKDAY({c}, 1,"2021-10-15")', mergeContext({ a: 0, b: '456', c: new Date('2021/10/15 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(1634486400000);

    expect(
      evaluate('WORKDAY({c}, -30)', mergeContext({ a: 0, b: '456', c: new Date('2021/10/15 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(1630598400000);

    expect(
      evaluate('WORKDAY({c}, -30, "2021-10-1")', mergeContext({ a: 0, b: '456', c: new Date('2021/10/15 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(1630512000000);

    expect(
      evaluate(
        'WORKDAY({c}, -30, "2021-10-1, 2021-9-2")',
        mergeContext({ a: 0, b: '456', c: new Date('2021/10/15 00:00:00').getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(1630425600000);

    expect(() =>
      evaluate('WORKDAY({c}, 1000000000)', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow('NaN');

    expect(() =>
      evaluate('WORKDAY({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow(ParamsCountError);
  });

  it('WORKDAY_DIFF', () => {
    expect(
      evaluate('WORKDAY_DIFF({c}, "2020-10-18")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(95);

    expect(
      evaluate('WORKDAY_DIFF({c}, "2023-02-28")', mergeContext({ a: 0, b: '456', c: new Date('2023/2/21 10:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(6);

    expect(
      evaluate(
        'WORKDAY_DIFF({c}, "2020-10-18", "2020-7-13")',
        mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(94);

    expect(
      evaluate(
        'WORKDAY_DIFF({c}, "2020-10-18", "2020-7-13, 2020-7-14")',
        mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(93);

    // Because you need to throw an error here, you need to catch the error and verify it through catch
    try {
      evaluate('WORKDAY_DIFF({c}, "null")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 00:00:00').getTime(), d: ['opt1', 'opt2'] }));
    } catch (error) {
      expect((error as Error).message).toBe('#Error!');
    }

    expect(
      evaluate(
        'WORKDAY_DIFF({c}, "1636963995466")',
        mergeContext({ a: 0, b: '456', c: new Date('2021/11/15 00:00:00').getTime(), d: ['opt1', 'opt2'] }),
      ),
    ).toEqual(1);

    expect(() =>
      evaluate('WORKDAY_DIFF({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/12/6 00:00:00').getTime(), d: ['opt1', 'opt2'] })),
    ).toThrow(ParamsCountError);
  });

  it('TIMESTR', () => {
    expect(evaluate('TIMESTR({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toEqual(
      '18:30:15',
    );

    expect(() => evaluate('TIMESTR()', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toThrow(
      ParamsCountError,
    );
  });

  it('DATESTR', () => {
    expect(evaluate('DATESTR({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toEqual(
      '2020-06-06',
    );

    expect(() => evaluate('DATESTR()', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toThrow(
      ParamsCountError,
    );
  });

  it('WEEKNUM', () => {
    expect(evaluate('WEEKNUM({c})', mergeContext({ a: 0, b: '456', c: new Date('2021-1-1').getTime(), d: ['opt1', 'opt2'] }))).toEqual(1);

    expect(evaluate('WEEKNUM({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toEqual(23);

    expect(evaluate('WEEKNUM({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/7 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toEqual(24);

    expect(
      evaluate('WEEKNUM({c}, "Monday")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/7 18:30:15').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(23);

    expect(() => evaluate('WEEKNUM()', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toThrow(
      ParamsCountError,
    );
  });

  it('IS_SAME', () => {
    expect(
      evaluate('IS_SAME({c}, "2020/6/6")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(false);

    expect(
      evaluate('IS_SAME({c}, "2020/6/6", "d")', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] })),
    ).toEqual(true);

    expect(() => evaluate('IS_SAME({c})', mergeContext({ a: 0, b: '456', c: new Date('2020/6/6 18:30:15').getTime(), d: ['opt1', 'opt2'] }))).toThrow(
      ParamsCountError,
    );
  });

  it('validate getDayjs function', () => {
    expect.assertions(3);

    try {
      getDayjs(null);
    } catch (error) {
      expect((error as Error).message).toBe('#Error!');
    }

    try {
      getDayjs('null');
    } catch (error) {
      expect((error as Error).message).toBe('#Error!');
    }

    expect(getDayjs('1636965086541')).toEqual(dayjs(1636965086541));
  });
});
