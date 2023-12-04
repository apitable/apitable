/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { CurrencyField } from 'model/field/currency_field';
import { APIMetaFieldType, FieldType, ICurrencyField, SymbolAlign, TSymbolAlign } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenCurrencyFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const currencyField: ICurrencyField = {
  name: 'Currency Field',
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
  name: 'Currency Field',
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

describe('The currency field reads property format check', () => {
  const valid = getOpenFieldProperty(currencyField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openCurrencyField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Currency field update property check', () => {
  const valid = validUpdateOpenProperty(currencyField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Currency field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(currencyField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...CurrencyField.defaultProperty(),
      ...propertyOptionalNotFill,
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, currencyField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check for currency field', () => {
  const valid = validAddOpenProperty(currencyField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});