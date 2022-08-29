import { renderHook } from '@testing-library/react-hooks';
import { noop } from 'lodash';
import { useSettingsButton } from 'hooks/use_settings_button';
import { createSimpleWrapper } from './simple_context_wrapper';

test('use settings button should work', () => {
  const wrapper = createSimpleWrapper();

  const { result } = renderHook(() => useSettingsButton(), { wrapper });
  const [isShowingSettings, toggleSettings] = result.current;
  expect(isShowingSettings).toBe(false);
  expect(toggleSettings).toEqual(noop);
});
