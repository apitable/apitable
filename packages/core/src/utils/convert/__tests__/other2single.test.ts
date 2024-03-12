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

import {
  str2single,
} from '..';
import { IReduxState } from '../../../exports/store/interfaces';

import {
  // ISingleSelectField,
  // FieldType,
  SingleSelectField,
} from 'model/field/select_field/single_select_field';
import { FieldType, IField } from '../../../types/field_types';

function getField(): [SingleSelectField, string[], any[], IField] {
  const table: IField = {
    property: {
      options: [],
    },
    type: FieldType.SingleSelect,
    id: '1',
    name: 'test',
  };
  const field: SingleSelectField = new SingleSelectField(table, {} as IReduxState);
  const names: any[] = [
    '123', 'xxx', 'ccc',
  ];
  const ids: any[] = [];
  names.forEach(name => ids.push(field.addOption(name)));
  return [field, names, ids, table];
}

describe('文本转单选 field 对应的 record 值', () => {
  it('test str2single 文本转单选', () => {
    const [field, , ids, oldField] = getField();
    const test = [
      { args: '44', expected: null },
      { args: ids[0], expected: ids[0] },
      { args: ids[1], expected: ids[1] },
      { args: ids[2], expected: ids[2] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2single(t.args, field, oldField)).toEqual(t.expected);
    });
  });
  it('test str2single 数字转单选', () => {
    const [field, , ids, oldField] = getField();
    const test = [
      { args: '44', expected: null },
      { args: ids[0], expected: ids[0] },
      { args: ids[1], expected: ids[1] },
      { args: ids[2], expected: ids[2] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2single(t.args, field, oldField)).toEqual(t.expected);
    });
  });
  it('test str2single 单选转单选', () => {
    const [field, , ids, oldField] = getField();
    const test = [
      { args: '44', expected: null },
      { args: ids[0], expected: ids[0] },
      { args: ids[1], expected: ids[1] },
      { args: ids[2], expected: ids[2] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2single(t.args, field, oldField)).toEqual(t.expected);
    });
  });
  it('test str2single 多选转单选', () => {
    const [field, , ids, oldField] = getField();
    oldField.type = FieldType.MultiSelect;
    const test = [
      { args: ['44'], expected: null },
      { args: [ids[0]], expected: ids[0] },
      { args: [ids[1]], expected: ids[1] },
      { args: [ids[2]], expected: ids[2] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2single(t.args, field, oldField)).toEqual(t.expected);
    });
  });
  it('test str2single 当 value 是数组时，oldField 必须是多选类型', () => {
    const [field, , ids, oldField] = getField();
    oldField.type = FieldType.MultiSelect;
    const test = [
      { args: ['xxxx'], type: FieldType.Text, expected: null },
      { args: [ids[0]], type: FieldType.Number, expected: ids[0] },
      { args: [ids[1]], type: FieldType.MultiSelect, expected: ids[1] },
    ];
    test.forEach(t => {
      expect(str2single(t.args, field, oldField)).toEqual(t.expected);
    });
  });
});
