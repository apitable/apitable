import { APIMetaFieldPropertyFormatEnums, APIMetaFieldType, BasicValueType, DateFormat, FieldType, IFormulaField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenFormulaFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const formulaField: IFormulaField = {
  name: '公式字段',
  id: 'fld1111',
  type: FieldType.Formula,
  property: {
    datasheetId: 'dst1111',
    expression: 'WORKDAY(\'2020/10/01\' , 1)',
    formatting: {
      dateFormat: DateFormat['YYYY/MM/DD'],
      includeTime: true,
      timeFormat: TimeFormat['HH:mm']
    }
  }
};

const openFormulaField: IOpenField = {
  name: '公式字段',
  id: 'fld1111',
  type: APIMetaFieldType.Formula,
  property: {
    expression: 'WORKDAY(\'2020/10/01\' , 1)',
    valueType: BasicValueType.DateTime,
    hasError: false,
    format: {
      type: APIMetaFieldPropertyFormatEnums.DateTime,
      format: {
        dateFormat: 'YYYY/MM/DD',
        timeFormat: 'HH:mm',
        includeTime: true
      }
    }
  }
};

const propertyOptionalFill: IUpdateOpenFormulaFieldProperty = {
  expression: 'WORKDAY(\'2020/10/01\' , 1)',
  format: {
    type: APIMetaFieldPropertyFormatEnums.DateTime,
    format: {
      dateFormat: 'YYYY/MM/DD',
      timeFormat: 'HH:mm',
      includeTime: true
    }
  }
};

const propertyOptionalNotFill: IUpdateOpenFormulaFieldProperty = {};

describe('公式字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(formulaField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openFormulaField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('公式字段更新property检查', () => {
  const valid = validUpdateOpenProperty(formulaField);
  it('不填可选字段', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('填可选字段', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('公式字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(formulaField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      datasheetId: formulaField.property.datasheetId,
      expression: ''
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, formulaField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('公式字段字段新增property检查', () => {
  const valid = validAddOpenProperty(formulaField);
  it('不填可选字段', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('填可选字段', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});
