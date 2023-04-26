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

import { SegmentType } from 'types';
import { MockDataBus, resetDataLoader } from './mock.databus';

const db = MockDataBus.getDatabase();

beforeAll(resetDataLoader);

describe('record info', () => {
  test('basic record info', async() => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    expect(view1!.id).toStrictEqual('viw1');

    const records = await view1!.getRecords({});

    const recordData = records.map(record => ({ id: record.id, comments: record.comments }));

    expect(recordData).toStrictEqual([
      {
        id: 'rec1',
        comments: [],
      },
      {
        id: 'rec2',
        comments: [],
      },
      {
        id: 'rec3',
        comments: [
          {
            revision: 7,
            createdAt: 1669886283547,
            commentId: 'cmt1001',
            unitId: '100004',
            commentMsg: {
              type: 'dfs',
              content: 'foo',
              html: 'foo',
            },
          },
        ],
      },
      {
        id: 'rec4',
        comments: [],
      },
      {
        id: 'rec5',
        comments: [],
      },
    ]);
  });
});

describe('getViewInfo', () => {
  test('verbatim', async() => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    expect(view1!.id).toStrictEqual('viw1');

    const records = await view1!.getRecords({});

    expect(records.length).toBeGreaterThan(1);

    expect(records[1]!.getViewObject(x => x)).toStrictEqual({
      id: 'rec2',
      data: {
        fld1: [{ type: SegmentType.Text, text: 'text 2' }],
        fld2: ['opt1'],
      },
      commentCount: 0,
    });
  });
});
