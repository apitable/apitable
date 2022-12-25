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

import { CellFormatEnum, FieldType, IMultiSelectField, IReduxState, ISingleSelectField, Reducers } from '@apitable/core';
import { MultiSelectField } from 'fusion/field/multi.select.field';
import { SingleSelectField } from 'fusion/field/single.select.field';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';

describe('SelectorField', () => {
  let single: SingleSelectField;
  let multi: MultiSelectField;
  let singleField: ISingleSelectField;
  let multiField: IMultiSelectField;
  let store: Store<IReduxState>;

  beforeAll(() => {
    single = new SingleSelectField();
    multi = new MultiSelectField();
    store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    singleField = {
      id: 'fldjLDaA41dsh',
      name: 'SingleSelect😭',
      type: FieldType.SingleSelect,
      property: {
        options: [
          {
            id: 'optXOidJQufLD',
            name: 'SingleSelect1😭',
            color: 1,
          },
          {
            id: 'optl40HRnzsqO',
            name: 'SingleSelect2😭',
            color: 2,
          },
        ],
      },
    };
    multiField = {
      id: 'fldwpUt9vj616',
      name: 'MultiSelect😊',
      type: FieldType.MultiSelect,
      property: {
        options: [
          {
            id: 'optmD8Wbh3Pw6',
            name: 'MultiSelect1😊',
            color: 1,
          },
          {
            id: 'optL19ioMxG72',
            name: 'MultiSelect2😊',
            color: 2,
          },
        ],
      },
    };
  });

  describe('SingleSelect--validate', () => {
    it('null--should pass', () => {
      expect(() => single.validate(null, singleField)).not.toThrow();
    });
    it('not string value--should throw an error', () => {
      expect(() => single.validate(1, singleField)).toThrow(/^api_param_select_field_value_type_error$/);
    });
  });

  describe('MultiSelect--validate', () => {
    it('null--should pass', () => {
      expect(() => multi.validate(null, multiField)).not.toThrow();
    });

    it('Non array--should throw ServerException', () => {
      expect(() => {
        multi.validate('MultiSelect3😭', multiField);
      }).toThrow(/^api_param_multiselect_field_type_error$/);
    });

    it('Non String Array--should throw ServerException', () => {
      expect(() => {
        multi.validate([1], multiField);
      }).toThrow(/^api_param_multiselect_field_value_type_error$/);
    });
  });

  describe('SingleSelect--roTransform', () => {
    it('SingleSelect1😭--Return option Id', async() => {
      expect(await single.roTransform('SingleSelect1😭', singleField)).toBe('optXOidJQufLD');
    });
  });

  describe('SingleSelect--voTransform', () => {
    it('optXOidJQufLD--json--Return option name', () => {
      expect(single.voTransform('optXOidJQufLD', singleField, { cellFormat: CellFormatEnum.JSON, store })).toBe('SingleSelect1😭');
    });

    it('optXOidJQufLD--string--Return option name', () => {
      expect(single.voTransform('optXOidJQufLD', singleField, { cellFormat: CellFormatEnum.STRING, store })).toBe('SingleSelect1😭');
    });
  });

  describe('MultiSelect--roTransform', () => {
    it('[MultiSelect1😊]--Return an array of option Id', async() => {
      expect(await multi.roTransform(['MultiSelect1😊'], multiField)).toStrictEqual(['optmD8Wbh3Pw6']);
    });
  });

  describe('MultiSelect--voTransform', () => {
    it('[optmD8Wbh3Pw6,optL19ioMxG72]--json--Return an array of option name', () => {
      expect(multi.voTransform(['optmD8Wbh3Pw6', 'optL19ioMxG72'], multiField, { cellFormat: CellFormatEnum.JSON, store })).toStrictEqual([
        'MultiSelect1😊',
        'MultiSelect2😊',
      ]);
    });

    it('[optmD8Wbh3Pw6,optL19ioMxG72]--string--Returns the option name splice string', () => {
      expect(multi.voTransform(['optmD8Wbh3Pw6', 'optL19ioMxG72'], multiField, { cellFormat: CellFormatEnum.STRING, store })).toBe(
        'MultiSelect1😊, MultiSelect2😊',
      );
    });
  });
});
