import { LastModifiedByField } from 'model';
import { APIMetaFieldType, CollectType, FieldType, ILastModifiedByField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenLastModifiedByFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const lastModifiedByField: ILastModifiedByField = {
  name: '修改人字段',
  id: 'fld1111',
  type: FieldType.LastModifiedBy,
  property: {
    datasheetId: 'dst1111',
    uuids: [],
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const openLastModifiedByField: IOpenField = {
  name: '修改人字段',
  id: 'fld1111',
  type: APIMetaFieldType.LastModifiedBy,
  property: {
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const propertyOptionalFill: IUpdateOpenLastModifiedByFieldProperty = {
  collectType: CollectType.SpecifiedFields,
  fieldIdCollection: ['fld2222']
};

const propertyOptionalNotFill: IUpdateOpenLastModifiedByFieldProperty = {
  collectType: CollectType.AllFields,
};

describe('修改人字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(lastModifiedByField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openLastModifiedByField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('修改人字段更新property检查', () => {
  const valid = validUpdateOpenProperty(lastModifiedByField);
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

describe('修改人字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(lastModifiedByField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...LastModifiedByField.defaultProperty(),
      collectType: CollectType.AllFields,
      datasheetId: lastModifiedByField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, lastModifiedByField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('修改人字段字段新增property检查', () => {
  const valid = validAddOpenProperty(lastModifiedByField);
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
