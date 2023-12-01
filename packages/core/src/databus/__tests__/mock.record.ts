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

import { IJOTAction, IOperation, OTActionName } from 'engine';
import { IRecord, IRecordCellValue } from 'exports/store/interfaces';
import { SegmentType } from 'types';

export const mockRecordVoTransformer = (() => {
  return (record: IRecord) => {
    return record;
  };
})();

export const mockRecordValues: IRecordCellValue[] = [
  {
    fld1: [{ type: SegmentType.Text, text: 'text4' }],
    fld2: ['opt2'],
  },
  {
    fld1: [{ type: SegmentType.Text, text: 'text5' }],
  },
  {
    fld2: ['opt1', 'opt3', 'opt2'],
  },
];

export const mockRecords: IRecord[] = [
  {
    id: 'rec4',
    data: {
      fld1: [{ type: SegmentType.Text, text: 'text4' }],
      fld2: ['opt2'],
    },
    comments: [],
    commentCount: 0,
    recordMeta: {},
  },
  {
    id: 'rec5',
    data: {
      fld1: [{ type: SegmentType.Text, text: 'text5' }],
      fld2: ['opt2', 'opt1'],
    },
    comments: [],
    commentCount: 0,
    recordMeta: {},
  },
  {
    id: 'rec6',
    data: {
      fld1: null,
      fld2: ['opt1', 'opt3', 'opt2'],
    },
    comments: [],
    commentCount: 0,
    recordMeta: {},
  },
];

export const mockDefaultRecord: IRecord = {
  id: 'rec4',
  data: {
    fld2: ['opt2', 'opt1'],
  },
  comments: [],
  commentCount: 0,
  recordMeta: {},
};

export const mockOperationOfAddRecords = (
  records: { id: string; rows: { view: number; index: number }[]; values?: IRecordCellValue }[],
): IOperation => ({
  actions: records.flatMap(({ id, rows, values }) => [
    ...rows.map(
      ({ view, index }) =>
        ({
          li: {
            recordId: id,
          },
          n: OTActionName.ListInsert,
          p: ['meta', 'views', view, 'rows', index],
        } as IJOTAction),
    ),
    {
      n: OTActionName.ObjectInsert,
      oi: {
        commentCount: 0,
        comments: [],
        data: values ?? {
          fld2: ['opt2', 'opt1'],
        },
        id,
        recordMeta: {},
      },
      p: ['recordMap', id],
    },
  ]),
  cmd: 'AddRecords',
  fieldTypeMap: records.some(({ values }) => values && 'fld1' in values)
    ? { fld1: 1, fld2: 4 }
    : {
      fld2: 4,
    },
});
