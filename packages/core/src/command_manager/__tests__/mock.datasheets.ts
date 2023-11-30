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

import { IBaseDatasheetPack } from 'exports/store/interfaces';
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
          fld3: {
            id: 'fld3',
            name: 'Field 3',
            type: FieldType.Member,
            property: {
              isMulti: true,
              shouldSendMsg: false,
              unitIds: ['100000', '100001', '100002'],
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
            rows: [{ recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec3' }],
          },
          {
            id: 'viw2',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2', hidden: true }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec1' }],
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
      revision: 1,
    },
  },
  dst2: {
    snapshot: {
      meta: {
        fieldMap: {
          'fld2-1': {
            id: 'fld2-1',
            name: 'Field 1',
            type: FieldType.Text,
            property: null,
          },
          'fld2-2': {
            id: 'fld2-2',
            name: 'Field 2',
            type: FieldType.Link,
            property: {
              foreignDatasheetId: 'dst3',
              brotherFieldId: 'fld3-2',
            },
          },
        },
        views: [
          {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }],
          },
        ],
      },
      recordMap: {
        'rec2-1': {
          id: 'rec2-1',
          data: {
            'fld2-1': [{ type: SegmentType.Text, text: 'text 1' }],
            'fld2-2': [],
          },
          commentCount: 0,
        },
        'rec2-2': {
          id: 'rec2-2',
          data: {
            'fld2-1': [{ type: SegmentType.Text, text: 'text 2' }],
            'fld2-2': ['rec3-1'],
          },
          commentCount: 0,
        },
      },
      datasheetId: 'dst2',
    },
    datasheet: {
      id: 'dst2',
      name: 'datasheet 2',
      description: 'this is datasheet 2',
      parentId: '',
      icon: '',
      nodeShared: false,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: {} as any,
      permissions: {} as any,
      revision: 2,
    },
  },
  dst3: {
    snapshot: {
      meta: {
        fieldMap: {
          'fld3-2': {
            id: 'fld3-2',
            name: '3 my field 2',
            type: FieldType.Link,
            property: {
              foreignDatasheetId: 'dst2',
              brotherFieldId: 'fld2-2',
            },
          },
          'fld3-1': {
            id: 'fld3-1',
            name: '3-Field 1',
            type: FieldType.Number,
            property: {
              precision: 1,
            },
          },
        },
        views: [
          {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld3-1' }, { fieldId: 'fld3-2' }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec3-1' }, { recordId: 'rec3-2' }],
          },
        ],
      },
      recordMap: {
        'rec3-1': {
          id: 'rec3-1',
          data: {
            'fld3-1': [{ type: SegmentType.Text, text: 'text 1' }],
            'fld3-2': ['rec2-2'],
          },
          commentCount: 0,
        },
        'rec3-2': {
          id: 'rec3-2',
          data: {
            'fld3-1': [{ type: SegmentType.Text, text: 'text 2' }],
            'fld3-2': [],
          },
          commentCount: 0,
        },
      },
      datasheetId: 'dst3',
    },
    datasheet: {
      id: 'dst3',
      name: 'datasheet 3',
      description: 'this is datasheet 3',
      parentId: '',
      icon: '',
      nodeShared: false,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: {} as any,
      permissions: {} as any,
      revision: 3,
    },
  },
};
