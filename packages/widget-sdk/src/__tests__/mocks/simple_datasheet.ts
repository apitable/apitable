import { FieldType, IFieldMap, ViewType } from '@apitable/core';
import { mockSnapshot, mockWidgetSdkDatasheet, mockWidgetSdkDatasheetPack } from './mock_datasheet';
import { mockWidgetSdkStore } from './mock_store';

const fieldMap: IFieldMap = {
  fld1111: {
    id: 'fld1111',
    name: 'title',
    type: FieldType.SingleText,
    property: {
      defaultValue: ''
    }
  },
  fld2222: {
    id: 'fld2222',
    name: 'option',
    type: FieldType.MultiSelect,
    property: {
      options: [{
        id: 'opt111',
        name: 'opt1',
        color: 0
      }, {
        id: 'opt222',
        name: 'opt2',
        color: 1
      }]
    }
  }
};

const datasheetState = mockWidgetSdkDatasheetPack({
  datasheet: mockWidgetSdkDatasheet({
    snapshot: mockSnapshot({
      meta: {
        fieldMap,
        views: [{
          id: 'viw1111',
          name: 'view1',
          type: ViewType.Grid,
          columns: Object.keys(fieldMap).map(fieldId => ({ fieldId })),
          rows: [],
          frozenColumnCount: 1
        }, {
          id: 'viw2222',
          name: 'view2',
          type: ViewType.Grid,
          columns: Object.keys(fieldMap).map(fieldId => ({ fieldId })),
          rows: [],
          frozenColumnCount: 1
        }],
      },
      recordMap: {}
    }),
  }) 
});
export const simpleDatasheet = mockWidgetSdkStore({
  datasheetMap: {
    [datasheetState.datasheet!.id]: datasheetState
  }
});