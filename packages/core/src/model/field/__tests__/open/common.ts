
import { Field } from 'model';
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
