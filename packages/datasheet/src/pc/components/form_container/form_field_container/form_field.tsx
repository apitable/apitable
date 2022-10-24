import { useCallback, useEffect, useRef, useContext } from 'react';
import * as React from 'react';
import { FieldType, IField, ILookUpField, Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import styles from './style.module.less';
import { useUnmount, useMount } from 'ahooks';
import { FieldEditor } from './field_editor';
import { usePrevious, useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { IEditor } from 'pc/components/editors/interface';
import { FormContext } from '../form_context';
import { useSelector } from 'react-redux';
import { useThemeColors } from '@vikadata/components';
import { Message } from 'pc/components/common';

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

// 移动端不需要背景色的 Field
const _notNeedBgFieldMobile = [FieldType.Attachment, FieldType.Link, FieldType.LookUp];

// 不需要背景色的 Field
const _notNeedBgField = [FieldType.Attachment, FieldType.Link, FieldType.LookUp, FieldType.Rating];

// 不需要激活态的 Field
const _notNeedActiveField = [FieldType.Checkbox, FieldType.Rating, FieldType.Formula];

const needPositionField = [FieldType.Member];

const needTriggerStartEditField = [FieldType.Number, FieldType.Percent, FieldType.Currency];

const compactField = [FieldType.SingleSelect, FieldType.MultiSelect];

export const FormField: React.FC<IFormFieldProps> = props => {
  const colors = useThemeColors();
  const shareId = useSelector(state => state.pageParams.shareId);
  const { datasheetId, field, isFocus = false, setFocusId, onClose, editable, recordId } = props;
  const previousFocus = usePrevious(isFocus);
  const editorRef = (useRef<(IFieldEditRef & HTMLDivElement) | null>(null) as any) as React.MutableRefObject<IEditor>;
  const { formData, formProps } = useContext(FormContext);
  const fieldId = field.id;
  // TODO(kailang) 下个 sprint 支持表单默认值
  // const hasSetField = has(formData, fieldId);
  // const defaultValue = Field.bindModel(field).defaultValue();
  // const cellValue = hasSetField ? (formData[fieldId] ?? null) : defaultValue;
  const cellValue = formData ? formData[fieldId] ?? null : null;
  const isLogin = useSelector(state => state.user.isLogin);
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

  const { entityField, lookupCellValue } = useSelector(state => {
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
    } catch {
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

  return (
    <div
      className={classNames(styles.formFieldItem, {
        [styles.displayItem]: isNeedBgField,
        [styles.active]: isFocus && editable && !notNeedActiveField.includes(entityFieldType),
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
