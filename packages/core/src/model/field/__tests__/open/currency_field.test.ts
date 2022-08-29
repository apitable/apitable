import { CurrencyField } from 'model';
import { APIMetaFieldType, FieldType, ICurrencyField, SymbolAlign, TSymbolAlign } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenCurrencyFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const currencyField: ICurrencyField = {
  name: '货币字段',
  id: 'fld1111',
  type: FieldType.Currency,
  property: {
    defaultValue: '1',
    precision: 1,
    symbol: '$',
    symbolAlign: SymbolAlign['left']
  }
};

const openCurrencyField: IOpenField = {
  name: '货币字段',
  id: 'fld1111',
  type: APIMetaFieldType.Currency,
  property: {
    defaultValue: '1',
    precision: 1,
    symbol: '$',
    symbolAlign: TSymbolAlign.Left
  }
};

const propertyOptionalFill: IUpdateOpenCurrencyFieldProperty = {
  defaultValue: '1',
  precision: 1,
  symbol: '$',
  symbolAlign: TSymbolAlign.Left
};

const propertyOptionalNotFill: IUpdateOpenCurrencyFieldProperty = {
  precision: 1,
  symbol: '$',
};

describe('货币字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(currencyField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openCurrencyField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('货币字段更新property检查', () => {
  const valid = validUpdateOpenProperty(currencyField);
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

describe('货币字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(currencyField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...CurrencyField.defaultProperty(),
      ...propertyOptionalNotFill,
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, currencyField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('货币字段字段新增property检查', () => {
  const valid = validAddOpenProperty(currencyField);
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
