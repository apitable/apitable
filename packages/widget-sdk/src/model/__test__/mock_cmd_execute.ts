import {
  CollaCommandName, DatasheetActions, ExecuteResult, FieldCmd, getNewIds, IAddFieldsOptions,
  IAddRecordsOptions, ICollaCommandExecuteResult, ICollaCommandOptions, ResourceType,
  IDeleteFieldOptions, IDPrefix, IJOTAction, IRecordMap, ISetRecordsOptions, ISetFieldAttrOptions,
  Selectors, IDeleteRecordOptions, IField, StoreActions,
} from '@apitable/core';
import { getSnapshot } from 'store';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';

const applyJOTOperations = StoreActions.applyJOTOperations;
/**
 * Wrapping with promise to simulate cmd asynchrony.
 * @param data 
 * @param status 
 */
function outputPromise(data: any, status: boolean = true): Promise<ICollaCommandExecuteResult<any>> {
  return new Promise((resolve, reject) => {
    status ? resolve({ result: ExecuteResult.Success, ...data }) : reject({ result: ExecuteResult.Fail, ...data });
  });
}

export const createMockCmdExecute = (context: {
  mockWidgetSdkData: MockWidgetSdkData
}) => {
  const { mockWidgetSdkData } = context;
  const state = mockWidgetSdkData.widgetSdkData as any;
  return (cmdOpts: ICollaCommandOptions) => {
    switch (cmdOpts.cmd) {
      case CollaCommandName.AddRecords: {
        const _cmdOpts = cmdOpts as IAddRecordsOptions;
        const newRecordIds = getNewIds(IDPrefix.Record, _cmdOpts.count);
        if (!_cmdOpts.cellValues?.length) {
          return outputPromise({ data: [] });
        }
        const recordMap: IRecordMap = {};
        _cmdOpts.cellValues.forEach((recordCellValue, index) => {
          recordMap[newRecordIds[index]!] = {
            id: newRecordIds[index]!,
            data: recordCellValue,
            commentCount: 0
          };
        });
        mockWidgetSdkData.addRecords(recordMap);
        return outputPromise({ data: newRecordIds });
      }
      case CollaCommandName.DeleteRecords: {
        const _cmdOpts = cmdOpts as IDeleteRecordOptions;
        const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData)!;
        const getFieldByFieldId = (fieldId: string) => {
          return Selectors.getField(state, fieldId, _cmdOpts.datasheetId);
        };

        const actions = DatasheetActions.deleteRecords(snapshot, {
          recordIds: _cmdOpts.data,
          getFieldByFieldId,
          state,
        });
        const operations = [{ cmd: _cmdOpts.cmd, actions }];
        const reduxAction = applyJOTOperations(operations, ResourceType.Datasheet, _cmdOpts.datasheetId || DEFAULT_DATASHEET_ID);
        mockWidgetSdkData.dispatch(reduxAction);

        return outputPromise({});
      }
      case CollaCommandName.AddFields: {
        const _cmdOpts = cmdOpts as IAddFieldsOptions;
        const newFieldIds = getNewIds(IDPrefix.Field, _cmdOpts.data.length);
        const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData);
        // Since there is no sending multiple columns to be added, only a single fieldId is returned here.
        let fieldId: string = '';
        const actions = _cmdOpts.data.reduce((pre, item, i) => {
          fieldId = newFieldIds[i] || '';
          const actions = FieldCmd.createNewField(snapshot!, { ...item.data, id: newFieldIds[i] } as IField, item);
          return pre.concat(actions);
        }, [] as IJOTAction[]);
        const operations = [{ cmd: _cmdOpts.cmd, actions }];
        const reduxAction = applyJOTOperations(operations, ResourceType.Datasheet, _cmdOpts.datasheetId || DEFAULT_DATASHEET_ID);
        mockWidgetSdkData.dispatch(reduxAction);
        return outputPromise({ data: fieldId });
      }
      case CollaCommandName.DeleteField: {
        const _cmdOpts = cmdOpts as IDeleteFieldOptions;
        const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData);

        const actions = DatasheetActions.deleteField2Action(snapshot!, {
          fieldId: _cmdOpts.data[0]?.fieldId || '',
          datasheetId: snapshot!.datasheetId
        })!;
        const operations = [{ cmd: _cmdOpts.cmd, actions }];

        const reduxAction = applyJOTOperations(operations, ResourceType.Datasheet, DEFAULT_DATASHEET_ID);
        mockWidgetSdkData.dispatch(reduxAction);
        return outputPromise({});
      }
      case CollaCommandName.SetRecords: {
        const _cmdOpts = cmdOpts as ISetRecordsOptions;
        const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData);
        const actions = _cmdOpts.data.reduce((pre, item) => {
          const { recordId, fieldId, value } = item;
          const action = DatasheetActions.setRecord2Action(snapshot!, {
            recordId,
            fieldId,
            value,
          });
          if (!action) {
            return pre;
          }
          return [...pre, action];
        }, [] as IJOTAction[]);
        const operations = [{ cmd: _cmdOpts.cmd, actions }];

        const reduxAction = applyJOTOperations(operations, ResourceType.Datasheet, _cmdOpts.datasheetId!);
        mockWidgetSdkData.dispatch(reduxAction);
        return outputPromise({});
      }

      case CollaCommandName.SetFieldAttr: {
        const _cmdOpts = cmdOpts as ISetFieldAttrOptions;
        const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData);
        const field = snapshot?.meta.fieldMap[_cmdOpts.fieldId];
        const actions = FieldCmd.setField({ model: state } as any, snapshot!, field!, _cmdOpts.data);
        const operations = [{ cmd: _cmdOpts.cmd, actions: actions.actions }];
        const reduxAction = applyJOTOperations(operations, ResourceType.Datasheet, _cmdOpts.datasheetId!);
        mockWidgetSdkData.dispatch(reduxAction);
        return outputPromise({});
      }
      default: return outputPromise({ data: null });
    }
  };
};
