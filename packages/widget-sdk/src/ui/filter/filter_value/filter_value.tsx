import React from 'react';
import { Field, FieldType, FOperator, IField, ILookUpField } from '@apitable/core';
import { IFilterValueProps } from './interface';
import { EditorType, getFieldByBasicType, getFieldEditorType } from './helper';
import { FilterCheckbox } from './filter_checkbox';
import { FilterNumber } from './filter_number';
import { FilterText } from './filter_text';
import { FilterRating } from './filter_rating';
import { FilterSelect } from './filter_select';
import { FilterDate } from './filter_date/filter_date';

export const FilterValue: React.FC<IFilterValueProps> = props => {
  const { onChange, value, field: _field, operator } = props;

  let field = _field;
  const editorType = getFieldEditorType(field);

  const { hasError, isComputed } = Field.bindModel(field);
  if (hasError) return <></>;

  if (isComputed) {
    if (field.type === FieldType.LookUp) {
      const expr = Field.bindModel(field as ILookUpField).getExpression();
      if (!expr) {
        const entityField = Field.bindModel(field as ILookUpField).getLookUpEntityField();
        if (entityField) {
          field = entityField;
        }
      }
    }
    const fakeField = getFieldByBasicType(field);
    if (fakeField) field = fakeField as IField;
  }

  function Editor(editorType: EditorType) {
    switch (editorType) {
      case EditorType.Text:
        return (
          (
            <FilterText
              value={value}
              field={field}
              onChange={onChange}
            />
          )
        );
      case EditorType.Boolean:
        return (
          <FilterCheckbox
            value={value}
            field={field}
            onChange={onChange}
          />
        );
      case EditorType.Number:
      case EditorType.Currency:
      case EditorType.Percent:
        return (
          (
            <FilterNumber
              field={field}
              value={value}
              onChange={onChange}
            />
          )
        );
      case EditorType.None:
        return <div />;
      case EditorType.Rating:
        return (
          (
            <FilterRating
              field={field}
              value={value}
              onChange={onChange}
            />
          )
        );
      case EditorType.Options: {
        return (
          <FilterSelect
            field={field}
            value={value}
            onChange={onChange}
            operator={operator}
          />
        );
      }
      case EditorType.DateTime: {
        return (
          <FilterDate
            field={field}
            value={value}
            onChange={onChange}
            operator={operator}
          />
        );
      }
      default:
        console.error('%s is not a never type', field.type);
        return <div />;
    }
  }

  // Determine if a field of this type requires an input box.
  const isDisplay = ![FOperator.IsEmpty, FOperator.IsNotEmpty].includes(operator);

  return (
    <div>
      {isDisplay && Editor(editorType)}
    </div>
  );
};
