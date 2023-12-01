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

import { IResourceOpsCollect } from 'command_manager';
import { OTActionName } from 'engine';
import { IBaseDatasheetPack } from 'exports/store/interfaces';
import { Role } from 'config/constant';
import { ViewType } from 'modules/shared/store/constants';
import { FieldType, SegmentType } from 'types';

export const mockDatasheetMap: Record<string, IBaseDatasheetPack> = {
  dst1: {
    snapshot: {
      meta: {
        fieldMap: {
          fld1: {
            id: 'fld1',
            name: 'field 1',
            type: FieldType.Text,
            property: null,
          },
          fld2: {
            id: 'fld2',
            name: 'field 2',
            type: FieldType.MultiSelect,
            property: {
              options: [
                { id: 'opt1', name: 'option 1', color: 0 },
                { id: 'opt2', name: 'option 2', color: 1 },
                { id: 'opt3', name: 'option 3', color: 2 },
              ],
              defaultValue: ['opt2', 'opt1'],
            },
          },
        },
        views: [
          {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2' }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec4' }, { recordId: 'rec5' }],
          },
          {
            id: 'viw2',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2', hidden: true }],
            frozenColumnCount: 1,
            name: 'view 2',
            rows: [{ recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec5' }, { recordId: 'rec1' }, { recordId: 'rec4' }],
          },
          {
            id: 'viw3',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2' }],
            frozenColumnCount: 1,
            name: 'view 3',
            rows: [{ recordId: 'rec3' }, { recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec6' }, { recordId: 'rec4' }],
          },
        ],
      },
      recordMap: {
        rec1: {
          id: 'rec1',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 1' }],
            fld2: ['opt2', 'opt1'],
          },
          commentCount: 0,
        },
        rec2: {
          id: 'rec2',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 2' }],
            fld2: ['opt1'],
          },
          commentCount: 0,
        },
        rec3: {
          id: 'rec3',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 3' }],
            fld2: [],
          },
          commentCount: 1,
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
        rec4: {
          id: 'rec4',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 4' }],
            fld2: ['opt3', 'opt2', 'opt1'],
          },
          commentCount: 0,
        },
        rec5: {
          id: 'rec5',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 5' }],
            fld2: ['opt3'],
          },
          commentCount: 0,
        },
      },
      datasheetId: 'dst1',
    },
    datasheet: {
      id: 'dst1',
      name: 'datasheet 1',
      description: 'this is datasheet 1',
      parentId: '',
      icon: '',
      nodeShared: false,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: {} as any,
      permissions: {} as any,
      revision: 12,
    },
    fieldPermissionMap: {
      fld1: {
        role: Role.Editor,
        setting: {
          formSheetAccessible: true,
        },
        permission: {
          editable: true,
          readable: true,
        },
        manageable: true,
      },
      fld2: {
        role: Role.Editor,
        setting: {
          formSheetAccessible: true,
        },
        permission: {
          editable: true,
          readable: true,
        },
        manageable: true,
      },
    },
  },
};

export const mockOpsCollectOfAddOneDefaultRecord = (recordId: string): IResourceOpsCollect[] => [
  {
    operations: [
      {
        actions: [
          {
            li: {
              recordId,
            },
            n: OTActionName.ListInsert,
            p: ['meta', 'views', 0, 'rows', 3],
          },
          {
            li: {
              recordId,
            },
            n: OTActionName.ListInsert,
            p: ['meta', 'views', 1, 'rows', 5],
          },
          {
            li: {
              recordId,
            },
            n: OTActionName.ListInsert,
            p: ['meta', 'views', 2, 'rows', 5],
          },
          {
            n: OTActionName.ObjectInsert,
            oi: {
              commentCount: 0,
              comments: [],
              data: {
                fld2: ['opt2', 'opt1'],
              },
              id: recordId,
              recordMeta: {},
            },
            p: ['recordMap', recordId],
          },
        ],
        cmd: 'AddRecords',
        fieldTypeMap: {
          fld2: 4,
        },
      },
    ],
    resourceId: 'dst1',
    resourceType: 0,
  },
];
