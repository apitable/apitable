import { getFieldOptionColor } from 'model/color';
import { ISelectField } from 'types';
import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenMultiSelectFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, transformProperty, updateOpenFieldPropertyTransformProperty
  , validAddOpenProperty, validUpdateOpenProperty } from './common';

const singleSelectField: ISelectField = {
  name: '多选字段',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: 'opt000',
        name: '测试标签1',
        color: 1
      },
      {
        id: 'opt001',
        name: '测试标签2',
        color: 2
      }
    ]
  }
};
const invalidIdField: ISelectField = {
  name: '多选字段',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: '',
        name: '测试标签1',
        color: 0
      },
      {
        id: '',
        name: '测试标签2',
        color: 0
      }
    ], 
    defaultValue: ['测试标签1']
  }
};

const fieldWithoutDefaultValue: ISelectField = {
  name: '多选字段',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: '',
        name: '测试标签1',
        color: 0
      },
      {
        id: '',
        name: '测试标签2',
        color: 0
      }
    ], 
  }
};

const openSingleSelectField: IOpenField = {
  id: 'fld1111',
  name: '多选字段',
  type: APIMetaFieldType.MultiSelect,
  property: {
    options: [
      {
        id: 'opt000',
        name: '测试标签1',
        color: getFieldOptionColor(1)
      },
      {
        id: 'opt001',
        name: '测试标签2',
        color: getFieldOptionColor(2)
      }
    ]
  }
};

const writeOpenPropertyDelete: IUpdateOpenMultiSelectFieldProperty = {
  options: [{
    id: 'opt000',
    name: '测试标签1',
    color: getFieldOptionColor(1).name
  }]
};

const writeOpenProperty: IUpdateOpenMultiSelectFieldProperty = {
  options: [{
    id: 'opt000',
    name: '测试标签1',
    color: getFieldOptionColor(1).name
  }, {
    id: 'opt001',
    name: '测试标签2',
    color: getFieldOptionColor(2).name
  }]
};

describe('多选字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(singleSelectField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openSingleSelectField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('多选字段更新property检查', () => {
  const valid = validUpdateOpenProperty(singleSelectField);
  it('输入会删除选项的property并带上副作用参数', () => {
    const result = valid(writeOpenPropertyDelete, { enableSelectOptionDelete: true });
    expect(result).toEqual(true);
  });

  it('输入会删除选项的property并不带副作用参数', () => {
    const result = valid(writeOpenPropertyDelete);
    expect(result).toEqual(false);
  });

  it('多选字段更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('多选字段新增property检查', () => {
  const valid = validAddOpenProperty(singleSelectField);
  it('输入正确的新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('新增property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('多选字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(singleSelectField);
  it('输入正确的更新property参数', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, singleSelectField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('多选字段字段新增property检查', () => {
  const valid = validAddOpenProperty(singleSelectField);
  it('property有值检查', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('transform property', () => {
  const property = transformProperty(invalidIdField);
  it('missing id, should generate option.id', () => {
    expect(property).toHaveProperty(['options', 0, 'id']);
  });

  it('missing color, should generate option.color', () => {
    expect(property).toHaveProperty(['options', 0, 'color']);
  });

  it('missing id, should change defaultValue to option.id', () => {
    expect(property).toHaveProperty(['options', 0, 'id'], property.defaultValue[0]);
  });

  it('missing defaultValue, should not change defaultValue to option.id', () => {
    const property = transformProperty(fieldWithoutDefaultValue);
    expect(property).not.toHaveProperty(['options', 'defaultValue']);
  });

});