import { IBaseDatasheetPack, ViewType, FieldType, SegmentType } from "@apitable/core";

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
              ],
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
      revision: 0,
    },
  },
};
