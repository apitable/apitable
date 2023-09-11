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

import { useState, FC, useRef, useEffect, useContext, memo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Field, IMeta, IViewColumn, FieldType } from '@apitable/core';

import { getParentNodeByClass } from 'pc/utils';
import { FormContext } from '../form_context';
import { FormField } from './form_field';
import { FormFieldUI } from './form_field_ui';

import styles from './style.module.less';

interface IViewColumnWithIndex extends IViewColumn {
  colIndex?: number;
}
interface IFormFieldContainerProps {
  viewId: string;
  datasheetId: string;
  editable: boolean;
  meta: IMeta;
  filteredColumns: IViewColumnWithIndex[];
  fieldUI?: any;
  recordId: string;
}

export const FormFieldContainer: FC<React.PropsWithChildren<IFormFieldContainerProps>> = memo((props) => {
  const { datasheetId, meta, editable, fieldUI, filteredColumns, recordId, viewId } = props;
  const { fieldMap } = meta;

  const clickWithinField = useRef<boolean>();
  const [focusId, setFocusId] = useState<string | null>(null);
  const { formData, formErrors } = useContext(FormContext);
  const DefaultFieldUI = fieldUI || FormFieldUI;

  useEffect(() => {
    function onMouseDown(e: MouseEvent | TouchEvent) {
      if (Boolean(getParentNodeByClass(e.target as HTMLElement, 'ant-drawer'))) return;
      if (clickWithinField.current) {
        clickWithinField.current = false;
        return;
      }
      setFocusId(null);
    }

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onMouseDown);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onMouseDown);
    };
  }, []);

  const onMouseDown = (type: FieldType, fieldId: string) => {
    clickWithinField.current = true;

    // Compatible with scenarios where clicking on a blank space in the date editor fails to focus
    if (type === FieldType.DateTime) {
      setFocusId(fieldId);
    }
  };

  return (
    <div className={styles.formFieldContainer}>
      <TransitionGroup>
        {filteredColumns.map((column, index) => {
          const fieldId = column.fieldId;
          const colIndex = column?.colIndex;
          const field = fieldMap[fieldId];
          const isComputedField = field && Field.bindModel(field).isComputed;
          const isFocus = focusId === fieldId;
          const { name, required, desc, type } = field || {};
          const errorMsg = formErrors && formErrors[fieldId];

          return (
            <CSSTransition key={fieldId} timeout={500} classNames="form-field-ui-transition">
              <div id={fieldId}>
                <DefaultFieldUI
                  errorMsg={errorMsg}
                  title={name}
                  required={isComputedField ? false : required}
                  desc={desc}
                  index={index + 1}
                  colIndex={typeof colIndex === 'number' ? colIndex : undefined}
                  fieldId={fieldId}
                  datasheetId={datasheetId}
                  viewId={viewId}
                  // Only the base fields are editable
                  editable={[
                    FieldType.SingleText,
                    FieldType.Text,
                    FieldType.SingleSelect,
                    FieldType.MultiSelect,
                    FieldType.Number,
                    FieldType.Currency,
                    FieldType.Percent,
                    FieldType.DateTime,
                    FieldType.Attachment,
                    FieldType.Member,
                    FieldType.Checkbox,
                    FieldType.Rating,
                    FieldType.URL,
                    FieldType.Phone,
                    FieldType.Email,
                    FieldType.Cascader,
                  ].includes(type)}
                >
                  <div
                    onMouseDown={() => onMouseDown(type, fieldId)}
                    onTouchStart={() => onMouseDown(type, fieldId)}
                    onFocus={() => setFocusId(fieldId)}
                  >
                    <FormField
                      field={field}
                      recordId={recordId}
                      formData={formData}
                      datasheetId={datasheetId}
                      isFocus={isFocus}
                      onClose={() => setFocusId(null)}
                      editable={editable}
                    />
                  </div>
                </DefaultFieldUI>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
});
