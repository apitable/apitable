import { OTActionName, ResourceType, Selectors, StoreActions } from '@apitable/core';
import { MockWidgetSdkData } from './mock_data';
import { DEFAULT_DATASHEET_ID, mockSnapshot } from './mock_datasheet';

const createSimpleDatasheet = () => {
  const linkDatasheetStore = MockWidgetSdkData.simpleDatasheetExample();
  const snapshot = Selectors.getSnapshot(linkDatasheetStore.widgetSdkData as any, DEFAULT_DATASHEET_ID); 
  linkDatasheetStore.dispatch(StoreActions.updateSnapshot('dstMock2', mockSnapshot({
    ...snapshot,
    datasheetId: 'dstMock2'
  })));
  linkDatasheetStore.dispatch(StoreActions.applyJOTOperations([{
    cmd: 'AddFields',
    actions: [
      {
        n: OTActionName.ListInsert,
        p: [
          'meta',
          'views',
          0,
          'columns',
          3
        ],
        li: {
          fieldId: 'fldLink'
        }
      },
      {
        n: OTActionName.ObjectInsert,
        p: [
          'meta',
          'fieldMap',
          'fldLink'
        ],
        oi: {
          id: 'fldLink',
          name: 'MagicLink',
          type: 7,
          property: {
            foreignDatasheetId: 'dstMock2'
          }
        }
      }
    ],
    mainLinkDstId: 'dstMock2'
  }], ResourceType.Datasheet, DEFAULT_DATASHEET_ID));
  return linkDatasheetStore.widgetSdkData;
};

export const simpleLinkDatasheet = createSimpleDatasheet;