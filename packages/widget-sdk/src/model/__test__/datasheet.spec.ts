import { Datasheet } from 'model';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { createMockCmdExecute } from './mock_cmd_execute';
import { createSimpleContextWrapper } from './simple_context_wrapper';
import * as utils from 'message/utils';
import { getFieldMap, getPrimaryFieldId, getSnapshot } from 'store';
import { FieldType } from 'interface';
import { Selectors, StoreActions } from '@apitable/core';
import { createMockPermissions } from '__tests__/utils';

const createContextDefault = (opt?: { needMock?: boolean }) => {
  const { needMock } = opt || {};
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();

  let cmdExecuteMock;
  if (needMock) {
    cmdExecuteMock = jest.spyOn(utils, 'cmdExecute').mockImplementation((cmdOptions: any) => {
      return createMockCmdExecute({ mockWidgetSdkData })(cmdOptions);
    });
  }

  const context = createSimpleContextWrapper({ mockWidgetSdkData });

  const datasheet = new Datasheet(DEFAULT_DATASHEET_ID, context);

  return {
    mockWidgetSdkData,
    cmdExecuteMock,
    datasheet,
  };
};

describe('datasheet modal should return the correct result', () => {
  test('Instantiate datasheet object successfully', () => {
    const { datasheet } = createContextDefault();
    expect(datasheet.id).toEqual(DEFAULT_DATASHEET_ID);
  });
  test('test addRecord', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });
    const recordId = await datasheet.addRecord({});
    expect(getSnapshot(mockWidgetSdkData.widgetSdkData)?.recordMap[recordId]?.id).toBe(recordId);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test addRecords', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const recordIds = await datasheet.addRecords([{ valuesMap: {}}]);
    const recordMap = getSnapshot(mockWidgetSdkData.widgetSdkData)!.recordMap;

    expect(recordIds.every((recId) => recordMap[recId])).toBe(true);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test setRecord', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;

    const recordId = await datasheet.addRecord({});
    await datasheet.setRecord(recordId, { [primaryFieldId]: '1111' });

    const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData, datasheet.id);

    const cellValue = Selectors.getCellValue(mockWidgetSdkData.widgetSdkData as any, snapshot!, recordId, primaryFieldId);
    expect(cellValue.map((v: any) => v.text).join('')).toBe('1111');
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test setRecords', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;

    const recordIds = await datasheet.addRecords([{ valuesMap: { [primaryFieldId]: '1111' }}, { valuesMap: { [primaryFieldId]: '1111' }}]);

    await datasheet.setRecords(
      recordIds.map((recordId, i) => ({
        id: recordId,
        valuesMap: {
          [primaryFieldId]: i.toString(),
        },
      })),
    );

    const result = recordIds.every((recId, i) => {
      const snapshot = getSnapshot(mockWidgetSdkData.widgetSdkData, datasheet.id);
      const cellValue = Selectors.getCellValue(mockWidgetSdkData.widgetSdkData as any, snapshot!, recId, primaryFieldId);
      return cellValue.map((v: any) => v.text).join('') == i;
    });
    expect(result).toBe(true);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test deleteRecord', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const recordId = await datasheet.addRecord({});
    const permission = datasheet.checkPermissionsForDeleteRecord(recordId);
    expect(permission.acceptable).toBe(true);
    await datasheet.deleteRecord(recordId);
    expect(getSnapshot(mockWidgetSdkData.widgetSdkData)?.recordMap[recordId]).toBe(undefined);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test deleteRecords', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const recordIds = await datasheet.addRecords([{ valuesMap: {}}]);
    await datasheet.deleteRecords(recordIds);
    const recordMap = getSnapshot(mockWidgetSdkData.widgetSdkData)!.recordMap;
    expect(recordIds.every((rec) => !recordMap[rec])).toBe(true);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test addField', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const fieldId = await datasheet.addField('test field', FieldType.SingleText, null);
    const fieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;

    expect(fieldMap[fieldId]?.id).toBe(fieldId);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('test deleteField', async() => {
    const { mockWidgetSdkData, cmdExecuteMock, datasheet } = createContextDefault({ needMock: true });

    const fieldId = await datasheet.addField('test field', FieldType.SingleText, null);
    await datasheet.deleteField(fieldId);

    const fieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;

    expect(fieldMap[fieldId]?.id).toBe(undefined);
    expect(cmdExecuteMock).toHaveBeenCalled();
    cmdExecuteMock?.mockRestore();
  });

  test('checkPermissionForAddRecord acceptable as true', () => {
    const { mockWidgetSdkData, datasheet } = createContextDefault();

    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;

    const res = datasheet.checkPermissionsForAddRecord({ [primaryFieldId]: '1' });
    expect(res.acceptable).toBe(true);
  });

  test('checkPermissionForAddRecord acceptable as false', () => {
    const { mockWidgetSdkData } = createContextDefault();

    // No node access.
    mockWidgetSdkData.dispatch(
      StoreActions.updateDatasheet(DEFAULT_DATASHEET_ID, {
        permissions: {
          ...createMockPermissions(),
          editable: false,
          rowCreatable: false,
        },
      }),
    );
    const context = createSimpleContextWrapper({ mockWidgetSdkData });

    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;

    const datasheet = new Datasheet(DEFAULT_DATASHEET_ID, context);
    const res = datasheet.checkPermissionsForAddRecord({ [primaryFieldId]: '1' });
    expect(res.acceptable).toBe(false);
  });
});
