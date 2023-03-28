import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { StoreActions } from '@apitable/core';
import { useCollaborators } from '../use_collaborators';

test('use collaborators should return collaborators array', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();

  mockWidgetSdkData.dispatch(StoreActions.activeDatasheetCollaborator({
    socketId: '/room#xxxxxx',
    userName: 'tester',
    memberName: 'tester',
    avatar: 'xxxx',
    createTime: 3700427354,
    activeDatasheet: '111',
    userId: '123456'
  }, DEFAULT_DATASHEET_ID));

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useCollaborators(), { wrapper });
  
  expect(result.current.length).toBe(1);
  expect(result.current?.[0]?.id).toBe('123456');
  expect(result.current?.[0]?.name).toBe('tester');
});
