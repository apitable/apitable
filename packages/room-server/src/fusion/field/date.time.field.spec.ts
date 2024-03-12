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

import { CellFormatEnum, DateFormat, FieldType, IDateTimeField, IReduxState, Reducers, TimeFormat } from '@apitable/core';
import { DateTimeField } from 'fusion/field/date.time.field';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';

describe('DatetimeField', () => {
  let fieldClass: DateTimeField;
  let field: IDateTimeField;
  let store: Store<IReduxState>;

  beforeAll(() => {
    fieldClass = new DateTimeField();
    store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));

    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Date',
      type: FieldType.DateTime,
      property: {
        dateFormat: DateFormat['YYYY-MM-DD'],
        timeFormat: TimeFormat['HH:mm'],
        includeTime: true,
        autoFill: true,
      },
    };
  });

  describe('validate', () => {
    it('null should return null', () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });

    it('Non Date String should throw ServerException', () => {
      expect(() => {
        fieldClass.validate('aaaa', field);
      }).toThrow(/^api_param_datetime_field_type_error$/);
    });

    it('Date Digital Timestamp should pass', () => {
      expect(() => fieldClass.validate(55521445, field)).not.toThrow();
    });

    it('Date Year Number should pass', () => {
      expect(() => fieldClass.validate(2020, field)).not.toThrow();
    });

    it('Date Year String--should pass', () => {
      expect(() => fieldClass.validate('2020', field)).not.toThrow();
    });

    it('Date String should pass', () => {
      expect(() => fieldClass.validate('2020-01-01 11:11:11', field)).not.toThrow();
    });

    it('Date Timestamp should pass', () => {
      expect(() => fieldClass.validate(1599893097514, field)).not.toThrow();
    });
  });

  describe('roTransform', () => {
    it('Date [2021] should return 1609430400000', async () => {
      expect(await fieldClass.roTransform(2021, field)).toBe(1609430400000);
    });

    it("Date ['2021'] should return 1609430400000", async () => {
      expect(await fieldClass.roTransform('2021', field)).toBe(1609430400000);
    });

    it("Date ['2021-01-01 00:00:00'] should return 1609430400000", async () => {
      expect(await fieldClass.roTransform('2021-01-01 00:00:00', field)).toBe(1609430400000);
    });

    it("Date ['2021-01-01T00:00:00Z'] should return 1609430400000", async () => {
      expect(await fieldClass.roTransform('2021-01-01T00:00:00Z', field)).toBe(1609430400000);
    });

    it("Date ['2020-09-12 18:37 +0800'] should return 1599935820000", async () => {
      expect(await fieldClass.roTransform('2020-09-12 18:37 +0800', field)).toBe(1599935820000);
    });

    it('Date [1609430400000] should return 1609430400000', async () => {
      expect(await fieldClass.roTransform(1609430400000, field)).toBe(1609430400000);
    });

    it('Date [55521445] should return 55521445', async () => {
      expect(await fieldClass.roTransform(55521445, field)).toBe(55521445);
    });
  });

  describe('voTransform', () => {
    it('cellFormat--json--should return 1609430400000', () => {
      expect(fieldClass.voTransform(1609430400000, field, { cellFormat: CellFormatEnum.JSON, store })).toBe(1609430400000);
    });

    it('cellFormat--string--should return 2021-01-01 00:00', () => {
      expect(fieldClass.voTransform(1609430400000, field, { cellFormat: CellFormatEnum.STRING, store })).toBe('2021-01-01 00:00');
    });
  });
});
