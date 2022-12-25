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

import { mockState } from '../../../formula_parser/__tests__/mock_state';
import { IField } from '../../../types/field_types';
import { Field } from '../index';

export const commonTestSuit = (valid: any) => {
  it('Enter a random string', function() {
    const [expectValue, receiveValue] = valid(Math.random().toString(36).slice(-8));
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Input undefined', function() {
    const [expectValue, receiveValue] = valid(undefined);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Input null', function() {
    const [expectValue, receiveValue] = valid(null);
    expect(receiveValue).toEqual(expectValue);
  });
};

export const getValidCellValue = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (receiveValue: any) => {
    return [{ value: receiveValue }, fieldMethod.validateCellValue(receiveValue)];
  };
};

export const getValidOpenWriteValue = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (receiveValue: any) => {
    return [{ value: receiveValue }, fieldMethod.validateOpenWriteValue(receiveValue)];
  };
};

export const validProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  const { error } = fieldMethod.validateProperty();
  return !error;
};
