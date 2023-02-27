import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { useCloudStorage } from '../use_cloud_storage';
import { ExecuteResult } from '@apitable/core';
import * as utils from 'message/utils';

test('use cloud storage should return a correct result', () => {
  const cmdExecuteMock = jest.spyOn(utils, 'cmdExecute').mockImplementation(() => {
    return new Promise((resolve) => {
      resolve({
        result: ExecuteResult.Success
      } as any);
    });
  });

  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useCloudStorage('key', 'test'), { wrapper });
  const [value, setValue, editable] = result.current;
  expect(value).toBe('test');
  setValue('1');
  expect(cmdExecuteMock).toHaveBeenCalled();
  expect(editable).toBe(true);
  cmdExecuteMock.mockRestore();
});
