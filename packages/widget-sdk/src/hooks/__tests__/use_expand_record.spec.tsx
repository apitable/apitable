import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { useExpandRecord } from '../use_expand_record';

test('use expand record should work', () => {
  const wrapper = createSimpleWrapper();
  
  const { result } = renderHook(() => useExpandRecord(), { wrapper });
  const expandRecord = result.current;
  expandRecord({
    recordIds: []
  });
  expect(expandRecord).toBeInstanceOf(Function);
});
