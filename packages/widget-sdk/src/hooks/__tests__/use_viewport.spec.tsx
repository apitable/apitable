import { renderHook } from '@testing-library/react-hooks';
import { noop } from 'lodash';
import { useViewport } from 'hooks/use_viewport';
import { createSimpleWrapper } from './simple_context_wrapper';

test('use viewport button should work', () => {
  const wrapper = createSimpleWrapper();

  const { result } = renderHook(() => useViewport(), { wrapper });
  const { isFullscreen, toggleFullscreen } = result.current;
  expect(isFullscreen).toBe(false);
  expect(toggleFullscreen).toEqual(noop);
});
