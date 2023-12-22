import {
  FieldType,
  IField,
  Field,
  BasicValueType,
  INumberFormatFieldProperty,
  INumberFieldProperty,
  NumberField,
  IDateTimeFieldProperty,
  DateTimeField,
} from '@apitable/core';

export enum EditorType {
  None,
  Text,
  Number,
  Rating, // Same as Number but separate out.
  Boolean,
  DateTime,
  Options,
  Member,
  Currency,
  Percent,
}

const editorMap = {
  [FieldType.Attachment]: EditorType.None,
  [FieldType.DateTime]: EditorType.DateTime,
  [FieldType.CreatedTime]: EditorType.DateTime,
  [FieldType.LastModifiedTime]: EditorType.DateTime,
  [FieldType.MultiSelect]: EditorType.Options,
  [FieldType.SingleSelect]: EditorType.Options,
  [FieldType.Number]: EditorType.Number,
  [FieldType.AutoNumber]: EditorType.Number,
  [FieldType.Currency]: EditorType.Currency,
  [FieldType.Percent]: EditorType.Percent,
  [FieldType.Rating]: EditorType.Rating,
  [FieldType.Text]: EditorType.Text,
  [FieldType.URL]: EditorType.Text,
  [FieldType.Email]: EditorType.Text,
  [FieldType.Phone]: EditorType.Text,
  [FieldType.Button]: EditorType.Text,
  [FieldType.Link]: EditorType.Text,
  [FieldType.OneWayLink]: EditorType.Text,
  [FieldType.WorkDoc]: EditorType.Text,
  [FieldType.Checkbox]: EditorType.Boolean,
  [FieldType.Member]: EditorType.Member,
  [FieldType.CreatedBy]: EditorType.Member,
  [FieldType.LastModifiedBy]: EditorType.Member,
  [FieldType.SingleText]: EditorType.Text,
  [FieldType.Cascader]: EditorType.Text,
};

export const getFieldEditorType = (field: IField): EditorType => {
  const { basicValueType, valueType, isComputed } = Field.bindModel(field);
  if (isComputed) {
    if (field.type === FieldType.LookUp) {
      const expr = Field.bindModel(field).getExpression();
      if (expr) {
        switch (basicValueType) {
          case BasicValueType.Number:
            return EditorType.Number;
          case BasicValueType.DateTime:
            return EditorType.DateTime;
          case BasicValueType.Boolean:
            return EditorType.Boolean;
          default:
            return EditorType.Text;
        }
      }
      const entityField = Field.bindModel(field).getLookUpEntityField();
      if (entityField) {
        // lookup out of the rating field, using the numeric editor.
        if (entityField.type === FieldType.Rating) return EditorType.Number;
        return editorMap[field.type] || getFieldEditorType(entityField);
      }
      return EditorType.None;
    }
    if (field.type === FieldType.Formula) {
      switch (valueType) {
        case BasicValueType.Number: {
          const formatType = (field.property?.formatting as INumberFormatFieldProperty)?.formatType;

          if (formatType === FieldType.Currency) {
            return EditorType.Currency;
          } else if (formatType === FieldType.Percent) {
            return EditorType.Percent;
          }
          return EditorType.Number;
        }
        case BasicValueType.DateTime:
          return EditorType.DateTime;
        case BasicValueType.Boolean:
          return EditorType.Boolean;
        default:
          return EditorType.Text;
      }
    }
  }
  return editorMap[field.type];
};

export const getFieldByBasicType = (field: IField) => {
  const { valueType } = Field.bindModel(field);
  switch (valueType) {
    case BasicValueType.Number:
      return {
        id: 'fidxxxxxxxxx',
        name: 'fakename',
        type: FieldType.Number,
        property: (field.property.formatting as INumberFieldProperty) || NumberField.defaultProperty(),
      };
    case BasicValueType.DateTime:
      return {
        id: 'fidxxxxxxxxx',
        name: 'fakename',
        type: FieldType.DateTime,
        property: (field.property.formatting as IDateTimeFieldProperty) || DateTimeField.defaultProperty(),
      };
    default:
      return;
  }
};
