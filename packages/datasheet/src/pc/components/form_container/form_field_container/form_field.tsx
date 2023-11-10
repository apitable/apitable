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

import { useUnmount, useMount } from 'ahooks';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useContext } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { FieldType, IField, ILookUpField, Selectors, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { IEditor } from 'pc/components/editors/interface';
import { usePrevious, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { FormContext } from '../form_context';
import { FieldEditor } from './field_editor';
import styles from './style.module.less';

export type IFieldEditRef = Pick<IEditor, 'focus' | 'setValue' | 'saveValue'>;

interface IFormFieldProps {
  datasheetId: string;
  field: IField;
  recordId: string;
  editable: boolean;
  formData?: { [key: string]: any };
  isFocus?: boolean;
  setFocusId?: (fieldId: string | null) => void;
  onClose?: (...args: any) => void;
}

// Field without background colour for mobile
const _notNeedBgFieldMobile = [FieldType.Attachment, FieldType.Link, FieldType.OneWayLink, FieldType.LookUp];

// Field without background colour
const _notNeedBgField = [FieldType.Attachment, FieldType.Link, FieldType.OneWayLink, FieldType.LookUp, FieldType.Rating];

// Field without active state
const _notNeedActiveField = [FieldType.Checkbox, FieldType.Rating, FieldType.Formula];

const needPositionField = [FieldType.Member];

const needTriggerStartEditField = [FieldType.Number, FieldType.Percent, FieldType.Currency];

const compactField = [FieldType.SingleSelect, FieldType.MultiSelect, FieldType.Cascader];

export const FormField: React.FC<React.PropsWithChildren<IFormFieldProps>> = (props) => {
  const colors = useThemeColors();
  const shareId = useAppSelector((state) => state.pageParams.shareId);
  const { datasheetId, field, isFocus = false, setFocusId, onClose, editable, recordId } = props;
  const previousFocus = usePrevious(isFocus);
  const editorRef = useRef<(IFieldEditRef & HTMLDivElement) | null>(null) as any as React.MutableRefObject<IEditor>;
  const { formData, formProps } = useContext(FormContext);
  const fieldId = field.id;
  // TODO(kailang) Next sprint supports form defaults
  // const hasSetField = has(formData, fieldId);
  // const defaultValue = Field.bindModel(field).defaultValue();
  // const cellValue = hasSetField ? (formData[fieldId] ?? null) : defaultValue;
  const cellValue = formData ? formData[fieldId] ?? null : null;
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const compactMode = formProps?.compactMode;
  const hasSubmitPermission = isLogin || formProps?.fillAnonymous;

  const commonProps = {
    style: {},
    datasheetId,
    editable,
    editing: true,
    disabled: !editable,
    recordId,
    height: 40,
    width: 300,
    field,
  };

  const notNeedBgFieldMobile = compactMode ? _notNeedBgFieldMobile : [..._notNeedBgFieldMobile, ...compactField];
  const notNeedBgField = compactMode ? _notNeedBgField : [..._notNeedBgField, ...compactField];
  const notNeedActiveField = compactMode ? _notNeedActiveField : [..._notNeedActiveField, ...compactField];

  const setFocusFunc = useCallback(
    (status: boolean) => {
      if (!editable) {
        return;
      }
      if (status && !isFocus) {
        setFocusId && setFocusId(fieldId);
      }
      if (!status && isFocus) {
        setFocusId && setFocusId(null);
      }
    },
    [editable, fieldId, isFocus, setFocusId],
  );

  const onEndEdit = useCallback(() => {
    setFocusFunc(false);
    editable && editorRef.current && editorRef.current.saveValue();
  }, [setFocusFunc, editable]);

  useEffect(() => {
    editorRef.current && editorRef.current.setValue(cellValue);
  }, [cellValue]);

  useEffect(() => {
    if (previousFocus && !isFocus) {
      onEndEdit();
    }
    if (isFocus && !isMobile) {
      editorRef.current?.focus();
    }
  }, [previousFocus, isFocus, onEndEdit, isMobile]);

  useMount(() => {
    isFocus && editorRef.current?.focus();
  });

  useUnmount(() => {
    onEndEdit();
    Message.destroy();
  });

  const { entityField, lookupCellValue } = useAppSelector((state) => {
    if (field.type !== FieldType.LookUp) {
      return {
        entityField: undefined,
        lookupCellValue: null,
      };
    }

    const snapshot = Selectors.getSnapshot(state, datasheetId)!;

    let lookupCellValue;
    try {
      lookupCellValue = Selectors.getCellValue(state, snapshot, recordId, field.id, true);
    } catch (_e) {
      lookupCellValue = null;
    }
    const entityField = Selectors.findRealField(state, field) as ILookUpField;

    return {
      entityField,
      lookupCellValue,
    };
  });

  const entityFieldType = (entityField && entityField.type) || field.type;

  const onMouseDown = () => {
    if (!editable) {
      if (hasSubmitPermission && shareId) {
        Message.destroy();
        setTimeout(() => {
          Message.warning({ content: t(Strings.form_only_read_tip), duration: 0 });
        }, 200);
      }
    } else {
      setFocusFunc(true);
      if (needTriggerStartEditField.includes(field.type)) {
        editorRef.current?.onStartEdit(cellValue);
      }
    }
  };

  const lookingUpOption = field.type === FieldType.LookUp && [FieldType.SingleSelect, FieldType.MultiSelect].includes(entityFieldType);
  const _isNeedBgField = isMobile ? !notNeedBgFieldMobile.includes(entityFieldType) : !notNeedBgField.includes(entityFieldType);
  const isNeedBgField = _isNeedBgField || lookingUpOption;

  if (field.type === FieldType.LookUp && lookupCellValue == null) {
    return <div style={{ color: colors.fc3, fontSize: '14px' }}>{t(Strings.this_field_no_reference_data_yet)}</div>;
  }

  const disableField = entityFieldType === FieldType.LookUp || entityFieldType === FieldType.Formula;

  const wordNotActiveMobile = isMobile && entityFieldType === FieldType.WorkDoc;

  return (
    <div
      className={classNames(styles.formFieldItem, {
        [styles.displayItem]: isNeedBgField,
        [styles.active]: isFocus && editable && !notNeedActiveField.includes(entityFieldType) && !wordNotActiveMobile,
        [styles.autoFit]: entityFieldType === FieldType.Checkbox,
        [styles.displayItemMobile]: isMobile && entityFieldType !== FieldType.Checkbox,
        [styles.editable]: isNeedBgField && editable && !disableField,
        [styles.needPosition]: needPositionField.includes(entityFieldType),
        formDisplayItem: isNeedBgField,
        [styles.lookupOption]: lookingUpOption,
        [styles.disable]: disableField,
      })}
      onMouseDown={onMouseDown}
      tabIndex={0}
    >
      <FieldEditor ref={editorRef} isFocus={isFocus} onClose={onClose} cellValue={cellValue} commonProps={commonProps} onMouseDown={onMouseDown} />
    </div>
  );
};
