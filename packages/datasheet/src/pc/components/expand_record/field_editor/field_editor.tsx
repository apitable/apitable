import { ConfigConstant, Field, FieldType, ILookUpField, Selectors, Strings, t } from '@vikadata/core';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { useFocusEffect } from 'pc/components/editors/hooks/use_focus_effect';
import { IEditor } from 'pc/components/editors/interface';
import { useResponsive } from 'pc/hooks';
import { isTouchDevice } from 'pc/utils';
import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { FieldBlock, ICommonProps } from './field_block';
import { FieldTitle } from './field_title';
import styles from './style.module.less';

interface IFieldEditorProps {
  datasheetId: string;
  fieldId: string;
  expandRecordId: string;
  isFocus: boolean;
  setFocus: (fieldId: string | null) => void;
  mirrorId?: string;
  showAlarm?: boolean;
  allowToInsertField?: boolean;
  colIndex?: number;
}

// 这里记录不需要背景色的字段，比如 附件，关联等
const notNeedBgField = [FieldType.Attachment, FieldType.Link];

export type IExpandFieldEditRef = Pick<IEditor, 'focus' | 'setValue' | 'saveValue'>;

const FieldEditorBase = (props: IFieldEditorProps) => {
  const { fieldId, datasheetId, mirrorId, expandRecordId, isFocus, setFocus, showAlarm, allowToInsertField, colIndex } = props;
  const [hover, setHover] = useState(false);
  const {
    snapshot,
    cellValue,
    cellEditable,
    fieldRole,
  } = useSelector(state => {
    const innerSnapshot = Selectors.getSnapshot(state, datasheetId)!;
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return {
      snapshot: innerSnapshot,
      cellValue: Selectors.getCellValue(state, innerSnapshot, expandRecordId, fieldId),
      cellEditable: Selectors.getPermissions(state, datasheetId, fieldId, mirrorId).cellEditable,
      fieldRole: Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId)
    };
  }, shallowEqual);

  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  const recordMap = snapshot.recordMap;
  const editorRef = useRef<IExpandFieldEditRef & HTMLDivElement | null>(null) as any as React.MutableRefObject<IEditor>;
  const [showTip, setShowTip] = useState(false);
  const timeoutRef = useRef<number>();
  const editable = cellEditable && (!fieldRole || fieldRole === ConfigConstant.Role.Editor);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const setFocusFunc = useCallback((status: boolean) => {
    if (!editable) {
      return;
    }
    if (status && !isFocus) {
      setFocus(fieldId);
    }

    if (!status && isFocus) {
      setFocus(null);
    }

  }, [editable, fieldId, isFocus, setFocus]);

  const onEndEdit = useCallback(() => {
    isFocus && editable && editorRef.current && editorRef.current.saveValue();
  }, [editable, isFocus]);

  useEffect(() => {
    editorRef.current && editorRef.current.setValue(cellValue as number);
  }, [cellValue]);

  // 需要用 useLayoutEffect 确保 editorRef.current 不为 null
  useLayoutEffect(() => {
    return () => {
      onEndEdit();
    };
  }, [onEndEdit]);

  useUpdateEffect(() => {
    if (!isFocus) {
      if (editable && editorRef.current) {
        editorRef.current.saveValue();
        editorRef.current.blur && editorRef.current.blur();
      }
    }
    if (isFocus && !isTouchDevice()) {
      editorRef.current?.focus(false);
    }
  }, [isFocus]);

  useFocusEffect(() => {
    isFocus && setTimeout(() => {
      editorRef.current?.focus(false);
    }, 0);
  }, []);

  function onMouseDown() {
    if (
      Field.bindModel(field).isComputed ||
      field.type === FieldType.AutoNumber ||
      (fieldRole && fieldRole !== ConfigConstant.Role.Editor)
    ) {
      window.clearTimeout(timeoutRef.current);
      setShowTip(true);
      timeoutRef.current = window.setTimeout(() => {
        setShowTip(false);
      }, 1000);
    }
    setFocusFunc(true);
  }

  const record = recordMap[expandRecordId];
  const commonProps: ICommonProps = {
    style: {},
    datasheetId,
    mirrorId,
    editable,
    record,
    field,
    height: 32,
    width: 100,
    // 这个 editing 只会影响编辑组件的可响应状态，与当前组件中 editing 含义不同。
    // 在卡片编辑中，所有的编辑组件都是展开状态，默认允许直接响应鼠标点击。
    editing: true,
    ref: editorRef,
  };

  if (!field || !record) {
    return <div />;
  }

  const entityField = field.type === FieldType.LookUp && Field.bindModel(field as ILookUpField).getLookUpEntityField();
  const fieldType = (entityField && entityField.type) || field.type;

  return (
    <>
      <FieldTitle
        fieldId={fieldId}
        recordId={record.id}
        isFocus={isFocus}
        datasheetId={datasheetId}
        onMouseDown={onMouseDown}
        cellValue={cellValue}
        marker
        editable={editable}
        showAlarm
        allowToInsertField={allowToInsertField}
        colIndex={colIndex}
        fieldMap={fieldMap}
        showFieldSetting={hover}
      />
      <Tooltip
        visible={showTip}
        title={t(Strings.uneditable_check_info)}
        placement={isMobile ? 'top' : 'left'}
        showTipAnyway
      >
        <div
          className={classNames('displayItem', {
            [styles.displayItem]: !notNeedBgField.includes(fieldType),
            [styles.disabled]: !editable,
            [styles.active]: isFocus && editable,
            [styles.checkBox]: fieldType === FieldType.Checkbox,
          })}
          style={{ width: '100%' }}
          onMouseDown={onMouseDown}
          onMouseOver={()=>{
            setHover(true);
          }}
          onMouseLeave={()=>{
            setHover(false);
          }}
        >
          <div className={classNames({
            [styles.mobileFieldContainer]: isMobile
          })}>
            <FieldBlock
              commonProps={commonProps}
              cellValue={cellValue}
              isFocus={isFocus}
              onMouseDown={onMouseDown}
              showAlarm={showAlarm}
            />
          </div>
        </div>
      </Tooltip>
    </>
  );
};
export const FieldEditor = React.memo(FieldEditorBase);
