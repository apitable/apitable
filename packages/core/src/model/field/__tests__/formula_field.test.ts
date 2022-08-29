import { validProperty } from './common';
import { IFormulaField } from '../../../types/field_types';

const formulaField: IFormulaField = {
  name: '公式字段',
  id: 'fld1111',
  type: 16,
  property: {
    expression: '1',
    datasheetId: 'dst123'
  }
};

describe('检查公式字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...formulaField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...formulaField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...formulaField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.datasheetId =""', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        datasheetId: ''
      }
    } as any)).toEqual(false);
  });

  it('property.expression =""', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        expression: ''
      }
    } as any)).toEqual(true);
  });

  it('property.datasheetId 格式不合法', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...formulaField,
    } as any)).toEqual(true);
  });
});
