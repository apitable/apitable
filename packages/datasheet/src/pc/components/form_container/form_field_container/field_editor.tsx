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

import { difference } from 'lodash';
import { forwardRef, useRef, useContext, useCallback } from 'react';
import * as React from 'react';
import { Button } from '@apitable/components';
import {
  IField,
  FieldType,
  ICellValue,
  IDateTimeField,
  ConfigConstant,
  ILinkIds,
  ILinkField,
  t,
  Strings,
  IAttachmentValue,
  Api,
  IAttacheField,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { CascaderEditor } from 'pc/components/editors/cascader_editor';
import { CheckboxEditor } from 'pc/components/editors/checkbox_editor';
import { DateTimeEditor } from 'pc/components/editors/date_time_editor';
import { EnhanceTextEditor } from 'pc/components/editors/enhance_text_editor';
import { RatingEditor } from 'pc/components/editors/rating_editor';
import { TextEditor } from 'pc/components/editors/text_editor';
import { ExpandAttachment, ExpandAttachContext } from 'pc/components/expand_record/expand_attachment';
import { ExpandFormula } from 'pc/components/expand_record/expand_formula';
import { ExpandLink, FetchForeignTimes } from 'pc/components/expand_record/expand_link';
import { ExpandLookUpBase } from 'pc/components/expand_record/expand_lookup';
import { ExpandNumber } from 'pc/components/expand_record/expand_number';
import { ExpandSelect } from 'pc/components/expand_record/expand_select';
import { FormWorkdocEditor } from 'pc/components/form_container/form_workdoc_editor';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { FormContext } from '../form_context';
import { ComputedFieldWrapper } from './computed_field_wrapper';
import { OptionFieldEditor, MemberFieldEditor } from './form_editors';
import styles from './style.module.less';

export interface ICommonProps {
  style: React.CSSProperties;
  datasheetId: string;
  editable: boolean;
  field: IField;
  recordId: string;
  height: number;
  width: number;
  editing: boolean;
}

export interface IEditor {
  focus(): void;
  onEndEdit(cancel: boolean): void;
  onStartEdit(cellValue?: ICellValue): void;
  setValue(cellValue?: ICellValue): void;
  saveValue(): void;
}

export interface IFormFieldProps {
  commonProps: ICommonProps;
  isFocus: boolean;
  onClose?: (...args: any) => void;
  cellValue: ICellValue;
  onMouseDown(e: React.MouseEvent): void;
}

export const FieldEditorBase: React.ForwardRefRenderFunction<IEditor, IFormFieldProps> = (props, ref) => {
  const { commonProps: baseProps, isFocus, onClose, cellValue, onMouseDown } = props;
  const { field, editable, recordId } = baseProps;
  const { formProps, setFormData, setFormErrors, setFormToStorage, mount } = useContext(FormContext);
  const attachmentRef = useRef<IAttachmentValue[]>([]);
  const shareId = useAppSelector((state) => state.pageParams.shareId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const compactMode = formProps?.compactMode;

  const onSave = useCallback(
    (value: any) => {
      let finalValue: ICellValue = null;

      if (value == null) {
        setFormData && setFormData(field.id, null);
        return;
      }
      switch (field.type) {
        case FieldType.Number:
        case FieldType.Currency:
        case FieldType.Percent:
          finalValue = Number(value);
          break;
        case FieldType.URL:
        case FieldType.Email:
        case FieldType.Phone:
        case FieldType.Text:
        case FieldType.SingleText:
        case FieldType.Checkbox:
        case FieldType.Rating:
        case FieldType.DateTime:
        case FieldType.Link:
        case FieldType.OneWayLink:
          finalValue = value;
          break;
        case FieldType.SingleSelect:
        case FieldType.MultiSelect:
          if (!value.length) {
            setFormData && setFormData(field.id, null);
            return;
          }
          finalValue = value;
          break;
        case FieldType.Attachment:
          attachmentRef.current = value;
          finalValue = attachmentRef.current;
          if (!value.length) {
            setFormData && setFormData(field.id, null);
            return;
          }
          break;
        case FieldType.Member:
          if (!shareId) {
            const diff = difference(value, cellValue as string[]);
            Api.commitRemind({
              isNotify: false,
              unitRecs: [
                {
                  unitIds: diff,
                },
              ],
            });
          }
          finalValue = value;
          break;
        default:
          finalValue = value;
      }
      setFormData && setFormData(field.id, finalValue);
    },
    [field.id, field.type, shareId, cellValue, setFormData],
  );

  const disabledStatusButton = (
    <Button className={styles.addBtn} size="small">
      <span className={styles.inner}>
        {<AddOutlined color="currentColor" className={styles.addIcon} />}
        {t(Strings.add)}
      </span>
    </Button>
  );

  const getCellValueFn = () => {
    return attachmentRef.current as IAttachmentValue[];
  };

  const handleFieldChange = (value: string) => {
    setFormErrors(field.id, '');
    setFormToStorage && setFormToStorage(field.id, value);
    onSave(value);
  };

  const commonProps = { ...baseProps, onSave, onChange: handleFieldChange };

  switch (field.type) {
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Percent:
      return (
        <ExpandNumber
          ref={ref}
          isFocus={isFocus}
          cellValue={cellValue as number}
          className={styles.formCellNumber}
          onBlur={onClose}
          {...commonProps}
        />
      );
    case FieldType.SingleText:
      return <TextEditor ref={ref} {...commonProps} onBlur={onClose} />;
    case FieldType.Text:
      return <TextEditor ref={ref} {...commonProps} onBlur={onClose} minRows={4} height={90} needEditorTip={false} />;
    case FieldType.Checkbox: {
      return (
        <CheckboxEditor
          ref={ref}
          cellValue={cellValue as boolean}
          {...commonProps}
          style={{
            padding: '0 16px',
            height: isMobile ? 48 : 40,
          }}
        />
      );
    }
    case FieldType.DateTime: {
      return (
        <DateTimeEditor
          {...commonProps}
          onClose={onClose}
          ref={(ele) => (((ref as React.MutableRefObject<IEditor>).current as any) = ele as any)}
          field={field as IDateTimeField}
          style={{ height: isMobile ? 48 : 40, alignItems: 'center' }}
        />
      );
    }
    case FieldType.Rating: {
      return (
        <RatingEditor
          ref={ref}
          {...commonProps}
          emojiSize={ConfigConstant.CELL_EMOJI_LARGE_SIZE}
          style={{
            paddingLeft: 0,
          }}
        />
      );
    }
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.Phone:
      return <EnhanceTextEditor ref={ref} {...commonProps} isForm />;
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return compactMode ? (
        <ExpandSelect {...commonProps} unitMap={null} cellValue={cellValue} isFocus={isFocus} onClose={onClose} onChange={onSave} />
      ) : (
        <OptionFieldEditor ref={ref} {...commonProps} cellValue={cellValue} />
      );
    case FieldType.Attachment:
      if (!(cellValue as IAttachmentValue[] | null)?.length) {
        attachmentRef.current = [];
      } else {
        attachmentRef.current = cellValue as IAttachmentValue[];
      }

      return editable ? (
        <ExpandAttachContext.Provider value={{ isFocus }}>
          <ExpandAttachment
            {...commonProps}
            field={field as IAttacheField}
            recordId={recordId}
            cellValue={attachmentRef.current as IAttachmentValue[]}
            getCellValueFn={getCellValueFn}
            onClick={onMouseDown}
          />
        </ExpandAttachContext.Provider>
      ) : (
        disabledStatusButton
      );
    case FieldType.Member:
      return <MemberFieldEditor {...commonProps} cellValue={cellValue} isFocus={isFocus} onClose={onClose} />;
    case FieldType.Cascader:
      return <CascaderEditor ref={ref} {...commonProps} toggleEditing={onClose} editing={isFocus} showSearch={false} />;
    case FieldType.Link:
    case FieldType.OneWayLink:
      return editable ? (
        <ExpandLink
          ref={ref}
          {...commonProps}
          recordId={recordId}
          field={commonProps.field as ILinkField}
          onClick={onMouseDown}
          cellValue={cellValue as ILinkIds}
          addBtnText={t(Strings.form_field_add_btn)}
          rightLayout={false}
          manualFetchForeignDatasheet={FetchForeignTimes.OnlyOnce}
        />
      ) : (
        disabledStatusButton
      );
    case FieldType.LookUp:
      return (
        <ComputedFieldWrapper title={t(Strings.tooltip_edit_form_lookup_field)} className={styles.formLookup}>
          {ExpandLookUpBase({ ...commonProps, field }) || <div className={styles.formLookUpFieldEmpty}>{t(Strings.form_link_field_empty)}</div>}
        </ComputedFieldWrapper>
      );
    case FieldType.Formula:
      return (
        <ComputedFieldWrapper className={styles.formFormula} title={t(Strings.tooltip_edit_form_formula_field)}>
          <ExpandFormula {...commonProps} recordId={recordId} />
        </ComputedFieldWrapper>
      );
    case FieldType.Button:
      return (<>/</>);
    case FieldType.WorkDoc:
      if (isMobile) {
        return <ComputedFieldWrapper className={styles.formWorkdoc} title={t(Strings.tooltip_edit_form_workdoc_field)} />;
      }
      return (
        <FormWorkdocEditor
          cellValue={cellValue}
          fieldId={field.id}
          editing={commonProps.editing}
          editable={commonProps.editable}
          datasheetId={commonProps.datasheetId}
          mount={mount}
          onSave={onSave}
          isMobile={isMobile}
        />
      );
    default:
      return <></>;
  }
};

export const FieldEditor = React.memo(forwardRef(FieldEditorBase));
