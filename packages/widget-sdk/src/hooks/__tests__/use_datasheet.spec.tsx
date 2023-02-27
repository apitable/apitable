import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { useDatasheet } from '../use_datasheet';
import { Datasheet } from '../../model';

test('use datasheet should return a Datasheet entity', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useDatasheet(), { wrapper });
  
  expect(result.current).toBeInstanceOf(Datasheet);
  expect(result.current!.id).toBe(DEFAULT_DATASHEET_ID);
});

