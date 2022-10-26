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
      name: '单选😭',
      type: FieldType.SingleSelect,
      property: {
        options: [
          {
            id: 'optXOidJQufLD',
            name: '单选1😭',
            color: 1,
          },
          {
            id: 'optl40HRnzsqO',
            name: '单选2😭',
            color: 2,
          },
        ],
      },
    };
    multiField = {
      id: 'fldwpUt9vj616',
      name: '多选😊',
      type: FieldType.MultiSelect,
      property: {
        options: [
          {
            id: 'optmD8Wbh3Pw6',
            name: '多选1😊',
            color: 1,
          },
          {
            id: 'optL19ioMxG72',
            name: '多选2😊',
            color: 2,
          },
        ],
      },
    };
  });

  describe('单选--validate', () => {
    it('null--should pass', () => {
      expect(() => single.validate(null, singleField)).not.toThrow();
    });
    it('not string value--should throw an error', () => {
      expect(() => single.validate(1, singleField)).toThrow(/^api_param_select_field_value_type_error$/);
    });
  });

  describe('多选--validate', () => {
    it('null--should pass', () => {
      expect(() => multi.validate(null, multiField)).not.toThrow();
    });

    it('非数组--should throw ServerException', () => {
      expect(() => {
        multi.validate('多选3😭', multiField);
      }).toThrow(/^api_param_multiselect_field_type_error$/);
    });

    it('非字符串数组--should throw ServerException', () => {
      expect(() => {
        multi.validate([1], multiField);
      }).toThrow(/^api_param_multiselect_field_value_type_error$/);
    });
  });

  describe('单选--roTransform', () => {
    it('单选1😭--返回选项ID', async() => {
      expect(await single.roTransform('单选1😭', singleField)).toBe('optXOidJQufLD');
    });
  });

  describe('多选--roTransform', () => {
    it('[多选1😊]--返回选项ID数组', async() => {
      expect(await multi.roTransform(['多选1😊'], multiField)).toStrictEqual(['optmD8Wbh3Pw6']);
    });
  });

  describe('单选--voTransform', () => {
    it('optXOidJQufLD--json--返回选项名称', () => {
      expect(single.voTransform('optXOidJQufLD', singleField, { cellFormat: CellFormatEnum.JSON, store })).toBe('单选1😭');
    });

    it('optXOidJQufLD--string--返回选项名称', () => {
      expect(single.voTransform('optXOidJQufLD', singleField, { cellFormat: CellFormatEnum.STRING, store })).toBe('单选1😭');
    });
  });

  describe('多选--voTransform', () => {
    it('[optmD8Wbh3Pw6,optL19ioMxG72]--json--返回选项名称数组', () => {
      expect(multi.voTransform(['optmD8Wbh3Pw6', 'optL19ioMxG72'], multiField, { cellFormat: CellFormatEnum.JSON, store })).toStrictEqual([
        '多选1😊',
        '多选2😊',
      ]);
    });

    it('[optmD8Wbh3Pw6,optL19ioMxG72]--string--返回选项名称拼接字符串', () => {
      expect(multi.voTransform(['optmD8Wbh3Pw6', 'optL19ioMxG72'], multiField, { cellFormat: CellFormatEnum.STRING, store })).toBe(
        '多选1😊, 多选2😊',
      );
    });
  });
});
