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

import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { TextButton, useThemeColors } from '@apitable/components';
import { Strings, t, ViewType, IViewColumn } from '@apitable/core';
import { TriangleDownFilled, TriangleRightFilled } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useGetViewByIdWithDefault } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import { FieldEditor } from './field_editor';
import styles from './style.module.less';

interface IFieldEditorContainer {
  fields: IViewColumn[];
  visible: boolean;
  focusFieldId: string | null;
  clickWithinField: React.MutableRefObject<boolean | undefined>;
  datasheetId: string;
  expandRecordId: string;
  setFocusFieldId: (focusFieldId: any) => void;
  mirrorId?: string;
}

const FieldEditorContainer = (props: IFieldEditorContainer) => {
  const { fields, visible = true, focusFieldId, clickWithinField, datasheetId, expandRecordId, setFocusFieldId, mirrorId } = props;
  if (!fields) {
    return null;
  }
  return (
    <>
      {fields.map((item, index) => {
        const isFocus = focusFieldId === item.fieldId;
        return (
          <div
            style={{ display: visible ? 'block' : 'none' }}
            key={item.fieldId}
            className={classNames(styles.fieldWrapper, 'fieldWrapper')}
            onMouseDown={() => {
              clickWithinField.current = true;
            }}
          >
            <FieldEditor
              datasheetId={datasheetId}
              mirrorId={mirrorId}
              fieldId={item.fieldId}
              expandRecordId={expandRecordId}
              isFocus={isFocus}
              setFocus={setFocusFieldId}
              showAlarm
              allowToInsertField
              colIndex={index}
            />
          </div>
        );
      })}
    </>
  );
};

interface IEditorContainerProp {
  datasheetId: string;
  mirrorId?: string;
  viewId?: string;
  focusFieldId: string | null;
  expandRecordId: string;
  clickWithinField: React.MutableRefObject<boolean | undefined>;
  showHiddenField: boolean;
  disappearHiddenField?: boolean;
  setShowHiddenField: (showHiddenField: boolean) => void;
  setFocusFieldId: (focusFieldId: any) => void;
  modalClose: () => void;
}

export const EditorContainer: React.FC<React.PropsWithChildren<IEditorContainerProp>> = (props) => {
  const {
    datasheetId,
    mirrorId,
    viewId,
    focusFieldId,
    setFocusFieldId,
    modalClose,
    expandRecordId,
    clickWithinField,
    showHiddenField,
    setShowHiddenField,
    disappearHiddenField,
  } = props;
  const view = useGetViewByIdWithDefault(datasheetId, viewId)!;
  const colors = useThemeColors();
  const isSideRecordOpen = useAppSelector((state) => state.space.isSideRecordOpen);

  const getHiddenProps = () => {
    switch (view.type) {
      case ViewType.Gantt:
        return 'hiddenInGantt';
      case ViewType.Calendar:
        return 'hiddenInCalendar';
      case ViewType.OrgChart:
        return 'hiddenInOrgChart';
      default:
        return 'hidden';
    }
  };

  const hiddenProp = getHiddenProps();

  const shownFields = useMemo(() => {
    const frozenField = view.columns[0];
    const remainShownFields = view.columns.slice(1).filter((field) => !field[hiddenProp]);
    return [frozenField, ...remainShownFields];
  }, [hiddenProp, view.columns]);
  const hiddenFields = useMemo(() => view.columns.slice(1).filter((field) => field[hiddenProp]), [hiddenProp, view.columns]);

  const visibleColumns = shownFields.concat(hiddenFields);

  function tab() {
    let index = visibleColumns.findIndex((column) => column.fieldId === focusFieldId) + 1;

    if (index >= visibleColumns.length) {
      index = 0;
    }

    if (visibleColumns[index][hiddenProp] && !showHiddenField) {
      _setShowHiddenField(true);
    }

    setFocusFieldId(visibleColumns[index].fieldId);
  }

  function shiftTab() {
    let index = visibleColumns.findIndex((column) => column.fieldId === focusFieldId) - 1;

    if (index < 0) {
      index = visibleColumns.length - 1;
    }

    setFocusFieldId(visibleColumns[index].fieldId);
  }

  function closeExpandWithoutFocus() {
    if (focusFieldId) {
      return;
    }
    modalClose();
  }

  useEffect(() => {
    if (!isSideRecordOpen) {
      ShortcutActionManager.bind(ShortcutActionName.RecordTab, tab);
      ShortcutActionManager.bind(ShortcutActionName.RecordShiftTab, shiftTab);
      ShortcutActionManager.bind(ShortcutActionName.CloseExpandRecord, closeExpandWithoutFocus);
      return () => {
        ShortcutActionManager.unbind(ShortcutActionName.RecordTab);
        ShortcutActionManager.unbind(ShortcutActionName.RecordShiftTab);
        ShortcutActionManager.unbind(ShortcutActionName.CloseExpandRecord);
      };
    }
    return undefined;
    // eslint-disable-next-line
  }, [isSideRecordOpen]);

  const _setShowHiddenField = (status: boolean) => {
    let list = getStorage(StorageName.ShowHiddenFieldInExpand) || [];
    const key = `${datasheetId},${view.id}`;

    if (status) {
      list.push(key);
    } else {
      list = list.filter((item) => item !== key);
    }
    setStorage(StorageName.ShowHiddenFieldInExpand, list, StorageMethod.Set);
    setShowHiddenField(status);
  };

  const HiddenFieldContent: React.ReactElement = (
    <>
      {!disappearHiddenField && (
        <div
          className={classNames(styles.hiddenFieldsHeader, {
            [styles.expanded]: showHiddenField,
          })}
        >
          <TextButton
            className={styles.btnExpand}
            onClick={() => {
              _setShowHiddenField(!showHiddenField);
            }}
            color="primary"
          >
            <div className={styles.dropdown}>
              {showHiddenField ? (
                <TriangleDownFilled size={12} color={colors.primaryColor} />
              ) : (
                <TriangleRightFilled size={12} color={colors.thirdLevelText} />
              )}
              <h5 className={styles.typography}>
                {!showHiddenField
                  ? t(Strings.show_hidden_fields_by_count, {
                    count: hiddenFields.length,
                  })
                  : t(Strings.folds_hidden_fields_by_count, {
                    count: hiddenFields.length,
                  })}
              </h5>
            </div>
          </TextButton>
        </div>
      )}

      <div className={styles.hiddenFieldsContent}>
        {showHiddenField && (
          <FieldEditorContainer
            mirrorId={mirrorId}
            fields={hiddenFields}
            visible={showHiddenField}
            focusFieldId={focusFieldId}
            clickWithinField={clickWithinField}
            datasheetId={datasheetId}
            expandRecordId={expandRecordId}
            setFocusFieldId={setFocusFieldId}
          />
        )}
      </div>
    </>
  );
  return (
    <>
      <FieldEditorContainer
        fields={shownFields}
        visible
        focusFieldId={focusFieldId}
        clickWithinField={clickWithinField}
        datasheetId={datasheetId}
        mirrorId={mirrorId}
        expandRecordId={expandRecordId}
        setFocusFieldId={setFocusFieldId}
      />
      {Boolean(hiddenFields.length) && HiddenFieldContent}
    </>
  );
};
