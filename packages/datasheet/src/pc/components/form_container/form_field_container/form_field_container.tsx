import { useState, FC, useRef, useEffect, useContext, memo } from 'react';
import { Field, IMeta, IViewColumn, FieldType } from '@vikadata/core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { FormField } from './form_field';
import { FormFieldUI } from './form_field_ui';

import { FormContext } from '../form_context';

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
  fieldUI?: any; // 按需定制 formField 的 UI
  recordId: string;
}

export const FormFieldContainer: FC<IFormFieldContainerProps> = memo((props) => {
  const { datasheetId, meta, editable, fieldUI, filteredColumns, recordId, viewId } = props;
  const { fieldMap } = meta;

  const clickWithinField = useRef<boolean>();
  const [focusId, setFocusId] = useState<string | null>(null);
  const { formData, formErrors } = useContext(FormContext);
  const DefaultFieldUI = fieldUI || FormFieldUI;

  useEffect(() => {
    function onMouseDown() {
      if (clickWithinField.current) {
        clickWithinField.current = false;
        return;
      }
      setFocusId(null);
    }

    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div className={styles.formFieldContainer}>
      <TransitionGroup>
        {
          filteredColumns.map((column, index) => {
            const fieldId = column.fieldId;
            const colIndex = column?.colIndex;
            const field = fieldMap[fieldId];
            const isComputedField = field && Field.bindModel(field).isComputed;
            const isFocus = focusId === fieldId;
            const { name, required, desc, type } = field || {};
            const errorMsg = formErrors && formErrors[fieldId];

            return (
              <CSSTransition
                key={fieldId}
                timeout={500} 
                classNames="form-field-ui-transition"
              >
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
                    // 仅基础字段可编辑
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
                    ].includes(type)}
                  >
                    <div
                      onMouseDown={() => { 
                        clickWithinField.current = true; 

                        // 兼容点击日期编辑器空白处无法聚焦的场景
                        if (type === FieldType.DateTime) {
                          setFocusId(fieldId);
                        }
                      }}
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
          })
        }
      </TransitionGroup>
    </div>
  );
});
