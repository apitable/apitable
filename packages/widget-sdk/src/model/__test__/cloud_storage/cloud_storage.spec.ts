import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import * as utils from 'message/utils';
import { createMockCmdExecute } from '../mock_cmd_execute';
import { CloudStorage } from 'model/cloud_storage';

describe('cloud storage modal should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const cmdExecuteMock = jest.spyOn(utils, 'cmdExecute').mockImplementation((cmdOptions: any) => {
    return createMockCmdExecute({ mockWidgetSdkData })(cmdOptions);
  });

  afterAll(() => {
    cmdExecuteMock.mockRestore();
  });
  test('test other accessor properties', () => {
    const cloudStorage = new CloudStorage({ a: '1' }, 'widget');
    expect(cloudStorage.get('a')).toBe('1');
    expect(cloudStorage.has('a')).toBe(true);
    cloudStorage.set('a', '2');
    expect(cmdExecuteMock).toHaveBeenCalled();
  });
});