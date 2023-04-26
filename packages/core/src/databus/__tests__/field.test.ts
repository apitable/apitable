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

import { FieldType } from 'types';
import { MockDataBus, resetDataLoader } from './mock.databus';

const db = MockDataBus.getDatabase();

beforeAll(resetDataLoader);

describe('field info', () => {
  test('basic field info', async() => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    expect(view1!.id).toStrictEqual('viw1');

    const fields = await view1!.getFields({});

    const fieldData = fields.map(field => ({ id: field.id, name: field.name, type: field.type }));

    expect(fieldData).toStrictEqual([
      {
        id: 'fld1',
        name: 'field 1',
        type: FieldType.Text,
      },
      {
        id: 'fld2',
        name: 'field 2',
        type: FieldType.MultiSelect,
      },
    ]);
  });
});

describe('getViewObject', () => {
  test('verbatim', async() => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    expect(view1!.id).toStrictEqual('viw1');

    const fields = await view1!.getFields({});

    expect(fields.length).toBeGreaterThan(1);

    expect(fields[1]!.getViewObject(x => x)).toStrictEqual({
      id: 'fld2',
      name: 'field 2',
      type: FieldType.MultiSelect,
      property: {
        options: [
          {
            color: 0,
            id: 'opt1',
            name: 'option 1',
          },
          {
            color: 1,
            id: 'opt2',
            name: 'option 2',
          },
          {
            color: 2,
            id: 'opt3',
            name: 'option 3',
          },
        ],
        defaultValue: ['opt2', 'opt1'],
      },
    });
  });
});
