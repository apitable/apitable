import { Datasheet } from 'model/datasheet';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { createSimpleContextWrapper } from '../simple_context_wrapper';
import * as utils from 'message/utils';
import { createMockCmdExecute } from '../mock_cmd_execute';
import { Record } from 'model/record';
import { getPrimaryFieldId } from 'store';

describe('record modal should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const context = createSimpleContextWrapper({ mockWidgetSdkData });
  const datasheet = new Datasheet(DEFAULT_DATASHEET_ID, context);
  const cmdExecuteMock = jest.spyOn(utils, 'cmdExecute').mockImplementation((cmdOptions: any) => {
    return createMockCmdExecute({ mockWidgetSdkData })(cmdOptions);
  });

  afterAll(() => {
    cmdExecuteMock.mockRestore();
  });
  test('test other accessor properties', async() => {
    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;
    const recordId = await datasheet.addRecord({ [primaryFieldId]: '1' });
    const record = new Record(datasheet.id!, context, recordId);
    expect(record.id).toBe(recordId);
    expect(record.recordId).toBe(recordId);
    expect(record.title).toBe('1');
    expect(record.getCellValue(primaryFieldId)).toBe('1');
    expect(record.getCellValueString(primaryFieldId)).toBe('1');
  });
});