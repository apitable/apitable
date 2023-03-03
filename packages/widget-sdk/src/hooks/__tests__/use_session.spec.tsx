import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { useSession } from '../use_session';
import { SET_USER_INFO } from 'store/constant';

test('use session should return a correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();

  mockWidgetSdkData.dispatch({
    type: SET_USER_INFO,
    payload: {
      userId: 'xxxx',
      memberName: 'tester',
      avatar: '',
      email: 'email'
    }
  });

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useSession(), { wrapper });

  expect(result.current.user.id).toBe('xxxx');
  expect(result.current.user.name).toBe('tester');
});
