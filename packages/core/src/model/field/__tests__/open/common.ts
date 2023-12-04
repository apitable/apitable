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

import { Field } from 'model/field';
import { IField, IFieldProperty } from 'types/field_types';
import { IAddOpenFieldProperty, IEffectOption, IUpdateOpenFieldProperty } from 'types/open/open_field_write_types';
import { mockState } from '../../../../formula_parser/__tests__/mock_state';

export const getOpenFieldProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (expectValue: any) => {
    return [expectValue, fieldMethod.openFieldProperty];
  };
};

export const validAddOpenProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (addOpenProperty: IAddOpenFieldProperty) => {
    const { error } = fieldMethod.validateAddOpenFieldProperty(addOpenProperty);
    return !error;
  };
};

export const validUpdateOpenProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (updateOpenProperty: IUpdateOpenFieldProperty, effectOption?: IEffectOption) => {
    const { error } = fieldMethod.validateUpdateOpenProperty(updateOpenProperty, effectOption);
    return !error;
  };
};

export const updateOpenFieldPropertyTransformProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (updateOpenProperty: IUpdateOpenFieldProperty, property: IFieldProperty) => {
    return [property, fieldMethod.updateOpenFieldPropertyTransformProperty(updateOpenProperty)];
  };
};

export const transformProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return fieldMethod.updateOpenFieldPropertyTransformProperty(field.property);
};
