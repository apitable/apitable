import { FieldType, IWidgetState } from 'interface';
import { Datasheet } from 'model/datasheet';
import { Field } from 'model/field';
import { getFieldMap, getPrimaryFieldId, getViews } from 'store';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { createSimpleContextWrapper } from '../simple_context_wrapper';
import * as utils from 'message/utils';
import { createMockCmdExecute } from '../mock_cmd_execute';
import { IOpenRatingFieldProperty, StoreActions } from '@apitable/core';
import { createMockPermissions } from '__tests__/utils';

describe('field modal should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const context = createSimpleContextWrapper({ mockWidgetSdkData });
  const datasheet = new Datasheet(DEFAULT_DATASHEET_ID, context);
  const cmdExecuteMock = jest.spyOn(utils, 'cmdExecute').mockImplementation((cmdOptions: any) => {
    return createMockCmdExecute({ mockWidgetSdkData })(cmdOptions);
  });

  const getPrimaryFieldDefault = (widgetSdkData: IWidgetState = mockWidgetSdkData.widgetSdkData) => {
    const fieldMap = getFieldMap(widgetSdkData, DEFAULT_DATASHEET_ID)!;
    const primaryFieldId = getPrimaryFieldId(widgetSdkData as any, DEFAULT_DATASHEET_ID)!;
    const primaryField = fieldMap[primaryFieldId]!;
    return primaryField;
  };

  afterAll(() => {
    cmdExecuteMock.mockRestore();
  });

  test('property is correct', async() => {
    const fieldId = await datasheet.addField('test', FieldType.Rating, { max: 3, icon: 'star' });
    const fieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;
    const field = new Field(DEFAULT_DATASHEET_ID, context, fieldMap[fieldId]!);
    const property = field.property as IOpenRatingFieldProperty;
    expect(property.max).toEqual(3);
    expect(property.icon).toEqual('⭐');
  });

  test('updateProperty is correct', async() => {
    const fieldId = await datasheet.addField('test', FieldType.Rating, { max: 3, icon: 'star' });
    const fieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;
    const field = new Field(DEFAULT_DATASHEET_ID, context, fieldMap[fieldId]!);
    await field.updateProperty({ max: 4, icon: 'stars' });
    const newFieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;
    const newField = new Field(DEFAULT_DATASHEET_ID, context, newFieldMap[fieldId]!);
    const property = newField.property as IOpenRatingFieldProperty;
    expect(property.max).toEqual(4);
    expect(property.icon).toEqual('🌠');
  });

  test('getPropertyInView', () => {
    const primaryField = getPrimaryFieldDefault();
    const viewId = getViews(mockWidgetSdkData.widgetSdkData)![0]?.id!;
    const field = new Field(DEFAULT_DATASHEET_ID, context, primaryField);
    expect(field.isPrimary).toBe(true);
    expect(Boolean(field.getPropertyInView(viewId)?.hidden)).toBe(false);
  });

  test('checkPermissionForUpdateProperty acceptable as true', () => {
    const primaryField = getPrimaryFieldDefault();
    
    const field = new Field(DEFAULT_DATASHEET_ID, context, primaryField);
    const res = field.checkPermissionForUpdateProperty({ defaultValue: '1' });
    expect(res.acceptable).toBe(true);
  });

  test('checkPermissionForUpdateProperty acceptable as false', () => {
    const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
    // No node access.
    mockWidgetSdkData.dispatch(StoreActions.updateDatasheet(DEFAULT_DATASHEET_ID, {
      permissions: {
        ...createMockPermissions(),
        manageable: false,
        fieldPropertyEditable: false
      }
    }));
    const context = createSimpleContextWrapper({ mockWidgetSdkData });

    const primaryField = getPrimaryFieldDefault(mockWidgetSdkData.widgetSdkData);

    const field = new Field(DEFAULT_DATASHEET_ID, context, primaryField);
    const res = field.checkPermissionForUpdateProperty({ defaultValue: '1' });
    expect(res.acceptable).toBe(false);
  });

  test('test other accessor properties', async() => {
    const fieldId = await datasheet.addField('test', FieldType.Rating, { max: 3, icon: 'star' });
    const fieldMap = getFieldMap(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID)!;
    const field = new Field(DEFAULT_DATASHEET_ID, context, fieldMap[fieldId]!);
    expect(field.isPrimary).toBe(false);
    expect(field.isComputed).toBe(false);
    expect(Boolean(field.required)).toBe(false);
    expect(field.type).toBe(FieldType.Rating);
  });
});