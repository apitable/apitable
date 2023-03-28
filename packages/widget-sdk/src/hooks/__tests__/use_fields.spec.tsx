import { renderHook } from '@testing-library/react-hooks';
import { useFields } from 'hooks/use_fields';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { getPrimaryFieldId, getViews } from 'store/selector';
import { Role, StoreActions } from '@apitable/core';

describe('use fields should return a field entity array', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;
  const viewId = views[0]!.id;

  test('have a no permission field', () => {
    const columns = views[0]?.columns || [];
    const noPermissionFieldId = (columns as any)[1]!.fieldId;
    // Set a column of permissions and useFields will filter.
    const fieldPermissionMap = {
      [noPermissionFieldId]: {
        role: Role.None,
        manageable: false,
        permission: {
          editable: false,
          readable: false
        },
        setting: {
          formSheetAccessible: true
        }
      }
    };
    mockWidgetSdkData.dispatch(StoreActions.updateDatasheet(DEFAULT_DATASHEET_ID, {
      fieldPermissionMap
    } as any));
    // No permission column display NoPermission.
    const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
    const { result } = renderHook(() => useFields(viewId), { wrapper });
  
    const validRes = result.current.some(f => f.name === 'NoPermission') && result.current.every(f => f.id !== noPermissionFieldId);
    expect(validRes).toBe(true);
  });

  test('use query ids to filter', () => {
    const wrapper = createSimpleWrapper();
    // Get the specified fieldId, take only the first column.
    const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;
    const { result: result1 } = renderHook(() => useFields(viewId, { ids: [primaryFieldId] }), { wrapper });
    expect(result1.current.length).toBe(1);
  });
});
