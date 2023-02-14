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

import {
  assertNever,
  Field, FieldType, FOperator,
  IField
} from '@apitable/core';
import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import produce from 'immer';
import { get, isEqual } from 'lodash';
import { useMemo, useState } from 'react';
import * as React from 'react';
import { IFilterValueProps } from '../interface';
import { FilterCheckbox } from './filter_checkbox';
import { FilterDate } from './filter_date';
import { FilterMember } from './filter_member';
import { FilterNumber } from './filter_number';
import { FilterOptions } from './filter_options';
import { FilterRating } from './filter_rating';
import { EditorType, getFieldByBasicType, getFieldEditorType } from './helper';
import styles from './style.module.less';

export const FilterValue: React.FC<React.PropsWithChildren<IFilterValueProps>> = props => {
  const { changeFilter, condition, conditionIndex, style = {}, hiddenClientOption } = props;
  const [value, setValue] = useState(condition.value ? condition.value[0] : '');
  let field = props.field;
  const editorType = getFieldEditorType(field);

  const { run: debounceInput } = useDebounceFn((inputValue: any) => {
    changeFilter && changeFilter(value => {
      return produce(value, draft => {
        const condition = draft.conditions[conditionIndex];
        draft.conditions[conditionIndex] = {
          ...condition,
          // Type inconsistency (e.g. magic lookup switching type), change to fix.
          fieldType: props.field.type,
          value: inputValue ? [inputValue] : null
        };
        return draft;
      });
    });
  }, { wait: 500 });

  useMemo(() => {
    setValue(condition.value ? condition.value[0] : '');
    // eslint-disable-next-line
  }, [field]);

  const { isComputed, hasError } = Field.bindModel(field);
  if (hasError) return <></>;
  if (isComputed) {
    if (field.type === FieldType.LookUp) {
      const expr = Field.bindModel(field).getExpression();
      if (!expr) {
        const entityField = Field.bindModel(field).getLookUpEntityField();
        if (entityField) {
          field = entityField;
        }
      }
    }
    const fakeField = getFieldByBasicType(field);
    if (fakeField) field = fakeField as IField;
  }

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    debounceInput(value);
  };

  const submitFilterValue = (selectValue: any) => {
    // The filter component of the toolbar is go here.
    changeFilter && changeFilter(value => {
      // Check that if the selectValue is the same as the old value, do not update the store.
      const noValueChange = isEqual(selectValue, get(value, `conditions.${conditionIndex}.value`));
      if (noValueChange) return value;
      return produce(value, draft => {
        if (typeof selectValue !== 'boolean') {
          selectValue = selectValue ? selectValue : null;
        }
        const condition = draft.conditions[conditionIndex];
        draft.conditions[conditionIndex] = {
          ...condition,
          // Type inconsistency (e.g. magic lookup switching type), change to fix.
          fieldType: props.field.type,
          value: selectValue
        };
        return draft;
      });
    });
  };

  function Editor(editorType: EditorType) {
    switch (editorType) {
      case EditorType.Options:
        return (
          <FilterOptions
            field={field}
            condition={condition}
            onChange={submitFilterValue}
          />
        );
      case EditorType.Text:
        return (
          (
            <div className={styles.inputContainer}>
              <Input
                value={value}
                className={styles.input}
                onChange={inputChange}
                suffix={''}
              />
            </div>
          )
        );
      case EditorType.DateTime:
        return (
          <FilterDate
            field={field}
            condition={condition}
            changeFilter={changeFilter}
            onChange={submitFilterValue}
            conditionIndex={conditionIndex}
          />
        );
      case EditorType.Boolean:
        return (
          <FilterCheckbox
            field={field}
            condition={condition}
            onChange={submitFilterValue}
          />
        );
      case EditorType.Rating:
        return (
          <FilterRating
            field={field}
            condition={condition}
            onChange={submitFilterValue}
          />
        );
      case EditorType.Member:
        return (
          <FilterMember
            hiddenClientOption={hiddenClientOption}
            field={field}
            condition={condition}
            onChange={submitFilterValue}
          />
        );
      case EditorType.Number:
      case EditorType.Currency:
      case EditorType.Percent:
        return (
          (
            <FilterNumber
              field={field}
              condition={condition}
              onChange={submitFilterValue}
            />
          )
        );
      case EditorType.None:
        return <div />;
      default:
        assertNever(editorType);
    }
    return <div />;
  }

  // Determine if a field of this type requires an input box.
  const isDisplay = ![FOperator.IsEmpty, FOperator.IsNotEmpty, FOperator.IsRepeat].includes(condition.operator);

  return (
    <div className={styles.filterValue} style={style}>
      {isDisplay && Editor(editorType)}
    </div>
  );
};
