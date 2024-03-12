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

import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { ConfigConstant, Field, FieldType, ILookUpField, Selectors, Strings, t } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useFocusEffect } from 'pc/components/editors/hooks/use_focus_effect';
import { IEditor } from 'pc/components/editors/interface';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { isTouchDevice } from 'pc/utils';
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

const notNeedBgField = [FieldType.Attachment, FieldType.Link, FieldType.OneWayLink];

export type IExpandFieldEditRef = Pick<IEditor, 'focus' | 'setValue' | 'saveValue'>;

const FieldEditorBase = (props: IFieldEditorProps) => {
  const { fieldId, datasheetId, mirrorId, expandRecordId, isFocus, setFocus, showAlarm, allowToInsertField, colIndex } = props;
  const [hover, setHover] = useState(false);
  const { snapshot, cellValue, cellEditable, fieldRole } = useAppSelector((state) => {
    const innerSnapshot = Selectors.getSnapshot(state, datasheetId)!;
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return {
      snapshot: innerSnapshot,
      cellValue: Selectors.getCellValue(state, innerSnapshot, expandRecordId, fieldId),
      cellEditable: Selectors.getPermissions(state, datasheetId, fieldId, mirrorId).cellEditable,
      fieldRole: Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId),
    };
  }, shallowEqual);

  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  const recordMap = snapshot.recordMap;
  const editorRef = useRef<(IExpandFieldEditRef & HTMLDivElement) | null>(null) as any as React.MutableRefObject<IEditor>;
  const [showTip, setShowTip] = useState(false);
  const timeoutRef = useRef<number>();
  const editable = cellEditable && (!fieldRole || fieldRole === ConfigConstant.Role.Editor);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const canWorkDocExpand = field.type === FieldType.WorkDoc && cellValue !== null;

  const setFocusFunc = useCallback(
    (status: boolean) => {
      if (!editable) {
        return;
      }
      if (status && !isFocus) {
        setFocus(fieldId);
      }

      if (!status && isFocus) {
        setFocus(null);
      }
    },
    [editable, fieldId, isFocus, setFocus],
  );

  const onEndEdit = useCallback(() => {
    isFocus && editable && editorRef.current && editorRef.current.saveValue();
  }, [editable, isFocus]);

  useEffect(() => {
    editorRef.current && editorRef.current.setValue(cellValue as number);
    // Cascader field.type to text should update value
  }, [cellValue, field.type]);

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
    isFocus &&
      setTimeout(() => {
        editorRef.current?.focus(false);
      }, 0);
  }, []);

  function onMouseDown() {
    if (Field.bindModel(field).isComputed ||
      field.type === FieldType.AutoNumber || (fieldRole && fieldRole !== ConfigConstant.Role.Editor)) {
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
      <Tooltip visible={showTip} title={t(Strings.uneditable_check_info)} placement={isMobile ? 'top' : 'left'} showTipAnyway>
        <div
          className={classNames('displayItem', {
            [styles.displayItem]: !notNeedBgField.includes(fieldType),
            [styles.disabled]: !editable && !canWorkDocExpand,
            [styles.active]: isFocus && editable,
            [styles.checkBox]: fieldType === FieldType.Checkbox,
          })}
          style={{ width: '100%' }}
          onMouseDown={onMouseDown}
          onMouseOver={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <div
            className={classNames(styles.fieldBlockWrap, {
              [styles.mobileFieldContainer]: isMobile,
              [styles.fieldButtonColumn]: field.type === FieldType.Button,
            })}
          >
            <FieldBlock commonProps={commonProps} cellValue={cellValue} isFocus={isFocus} onMouseDown={onMouseDown} showAlarm={showAlarm} />
          </div>
        </div>
      </Tooltip>
    </>
  );
};
export const FieldEditor = React.memo(FieldEditorBase);
