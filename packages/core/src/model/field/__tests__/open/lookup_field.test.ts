import { APIMetaFieldPropertyFormatEnums, DateFormat, FieldType, ILookUpField, RollUpFuncType, TimeFormat } from 'types';
import { IUpdateOpenMagicLookUpFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const lookupField: ILookUpField = {
  name: '引用字段',
  id: 'fld1111',
  type: FieldType.LookUp,
  property: {
    datasheetId: 'dst123',
    relatedLinkFieldId: 'fldxxxx',
    lookUpTargetFieldId: 'fldccc',
    rollUpType: RollUpFuncType.AND,
    formatting: {
      dateFormat: DateFormat['YYYY/MM/DD'],
      includeTime: true,
      timeFormat: TimeFormat['HH:mm']
    }
  }
};

// const openLookUpField: IOpenField = {
//   name: '引用字段',
//   id: 'fld1111',
//   type: APIMetaFieldType.MagicLookUp,
//   property: {
//     relatedLinkFieldId: 'fldxxxx',
//     targetFieldId: 'fldccc',
//     hasError: false,
//     rollupFunction: RollUpFuncType.AND,
//     valueType: 'String',
//     format: {
//       type: APIMetaFieldPropertyFormatEnums.DateTime,
//       format: {
//         dateFormat: 'YYYY/MM/DD',
//         timeFormat: 'HH:mm',
//         includeTime: true
//       }
//     }
//   }
// };

const propertyOptionalFill: IUpdateOpenMagicLookUpFieldProperty = {
  relatedLinkFieldId: 'fldxxxx',
  targetFieldId: 'fldccc',
  rollupFunction: RollUpFuncType.AND,
  format: {
    type: APIMetaFieldPropertyFormatEnums.DateTime,
    format: {
      dateFormat: 'YYYY/MM/DD',
      timeFormat: 'HH:mm',
      includeTime: true
    }
  }
};

const propertyOptionalNotFill: IUpdateOpenMagicLookUpFieldProperty = {
  relatedLinkFieldId: 'fldxxxx',
  targetFieldId: 'fldccc'
};

describe('神奇引用字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(lookupField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid({
      hasError: true,
      relatedLinkFieldId: 'fldxxxx',
      rollupFunction: RollUpFuncType.AND,
      targetFieldId: 'fldccc',
    });
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('神奇引用字段更新property检查', () => {
  const valid = validUpdateOpenProperty(lookupField);
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

describe('神奇引用字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(lookupField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      relatedLinkFieldId: 'fldxxxx',
      lookUpTargetFieldId: 'fldccc',
      datasheetId: lookupField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, lookupField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('神奇引用字段字段新增property检查', () => {
  const valid = validAddOpenProperty(lookupField);
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
