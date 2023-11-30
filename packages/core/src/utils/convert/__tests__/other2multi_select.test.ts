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

import { MultiSelectField } from '../../../model/field/select_field/multi_select_field';
import { FieldType, IField } from '../../../types/field_types';
import { str2multi } from '..';
import { IReduxState } from '../../../exports/store/interfaces';

function getField(): [MultiSelectField, string[], any[], IField] {
  const table: IField = {
    property: {
      options: [],
    },
    type: FieldType.MultiSelect,
    id: '1',
    name: 'test',
  };
  const field: MultiSelectField = new MultiSelectField(table, {} as IReduxState);

  const names = [
    '123', 'xxx', 'ccc',
  ];
  const ids: any[] = [];
  names.forEach(name => ids.push(field.addOption(name)));
  return [field, names, ids, table];
}

describe('文本转多选 field 对应的 record 值', () => {
  it('test str2multi 文本转多选', () => {
    const [field, names, ids, oldFiled] = getField();
    const test = [
      { args: '44', expected: null },
      { args: names[0]!, expected: [ids[0]] },
      { args: names[1]!, expected: [ids[1]] },
      { args: names[2]!, expected: [ids[2]] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2multi(t.args, field, oldFiled)).toEqual(t.expected);
    });
  });
  it('test str2multi 数字转多选', () => {
    const [field, names, ids, oldFiled] = getField();
    const test = [
      { args: '44', expected: null },
      { args: names[0]!, expected: [ids[0]] },
      { args: names[1]!, expected: [ids[1]] },
      { args: names[2]!, expected: [ids[2]] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2multi(t.args, field, oldFiled)).toEqual(t.expected);
    });
  });
  it('test str2multi 单选转多选', () => {
    const [field, names, ids, oldFiled] = getField();
    const test = [
      { args: '44', expected: null },
      { args: names[0]!, expected: [ids[0]] },
      { args: names[1]!, expected: [ids[1]] },
      { args: names[2]!, expected: [ids[2]] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2multi(t.args, field, oldFiled)).toEqual(t.expected);
    });
  });
  it('test str2multi 多选转多选', () => {
    const [field, , ids, oldFiled] = getField();
    const test = [
      { args: '44', expected: null },
      { args: [ids[0]], expected: [ids[0]] },
      { args: [ids[1]], expected: [ids[1]] },
      { args: [ids[2], ids[1]], expected: [ids[2], ids[1]] },
      { args: [ids[2], 'xxx'], expected: [ids[2]] },
      { args: ['xxx', ids[0], 'xxx'], expected: [ids[0]] },
      { args: null, expected: null },
    ];
    test.forEach(t => {
      expect(str2multi(t.args, field, oldFiled)).toEqual(t.expected);
    });
  });
  it('test str2multi 当 value 是数组时，oldField 必须是多选类型', () => {
    const [field, , ids, oldFiled] = getField();
    const test = [
      { args: ['xxxx'], type: FieldType.Text, expected: null },
      { args: [ids[0]], type: FieldType.Number, expected: [ids[0]] },
      { args: [ids[1]], type: FieldType.MultiSelect, expected: [ids[1]] },
    ];
    test.forEach(t => {
      expect(str2multi(t.args, field, oldFiled)).toEqual(t.expected);
    });
  });
});
