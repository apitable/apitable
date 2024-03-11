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

import { isEmpty } from 'lodash';
import * as React from 'react';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, useThemeColors } from '@apitable/components';
import { ILinkField, ILinkIds, IReduxState, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { AddOutlined, ChevronDownOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { RecordCard } from 'pc/components/common/record_card';
import { TComponent } from 'pc/components/common/t_component';
import { useCellEditorVisibleStyle } from 'pc/components/editors/hooks';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { LinkEditor, LinkEditorModalLayout } from 'pc/components/editors/link_editor';
import { ExpandLinkContext } from 'pc/components/expand_record/expand_link/expand_link_context';
import { expandRecordInCenter } from 'pc/components/expand_record/expand_record.utils';
import { expandPreviewModalClose } from 'pc/components/preview_file';
import { useDispatch, useGetViewByIdWithDefault, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { DEFAULT_LINK_RECORD_COUNT, KeyCode, stopPropagation } from 'pc/utils';
import { getDatasheetOrLoad } from 'pc/utils/get_datasheet_or_load';
import { IExpandFieldEditRef } from '../field_editor';
import style from './style.module.less';

export interface IExpandLinkProps extends IBaseEditorProps {
  field: ILinkField;
  recordId: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  onClick: (e: React.MouseEvent) => void;
  cellValue: ILinkIds;
  addBtnText?: string;
  keyPrefix?: string;
  rightLayout?: boolean;
  manualFetchForeignDatasheet?: FetchForeignTimes;
  mirrorId?: string;
}

export enum FetchForeignTimes {
  OnlyOnce = 'onlyOnce',
  EveryTime = 'everyTime',
}

const ExpandLinkBase: React.ForwardRefRenderFunction<IExpandFieldEditRef, IExpandLinkProps> = (props, ref) => {
  const {
    field,
    recordId,
    onClick,
    keyPrefix,
    addBtnText,
    rightLayout = true,
    onSave,
    datasheetId,
    manualFetchForeignDatasheet,
    mirrorId,
  } = props;
  const editable = props.editable;
  const colors = useThemeColors();
  const focusRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<IEditor>(null);
  const [editing, setEditing] = useState(false);
  const manualFetch = useRef(0);
  const lastFetch = useRef(-1);
  const cellValue = (props.cellValue as string[]) || null;
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);
  const hasShowMoreBtn = Boolean(cellValue && cellValue.length && cellValue.length > DEFAULT_LINK_RECORD_COUNT && !isShowMoreOpen);
  const showCellValues = hasShowMoreBtn ? cellValue.slice(0, DEFAULT_LINK_RECORD_COUNT) : cellValue;
  const getRestRecordsCount = () => cellValue.length - DEFAULT_LINK_RECORD_COUNT;
  const needIgnoreFetch = !manualFetchForeignDatasheet
    ? false
    : manualFetchForeignDatasheet === FetchForeignTimes.OnlyOnce
      ? !manualFetch.current
      : false;
  const { foreignDatasheet, foreignDatasheetErrorCode } = useAppSelector((state: IReduxState) => {
    return {
      foreignDatasheet: Selectors.getDatasheet(state, field.property.foreignDatasheetId)!,
      foreignDatasheetErrorCode: Selectors.getDatasheetErrorCode(state, field.property.foreignDatasheetId),
    };
  });

  const { foreignSnapshot, foreignDatasheetName } = useAppSelector((state: IReduxState) => {
    if (!editing && isEmpty(showCellValues)) {
      return {
        foreignSnapshot: undefined,
        foreignDatasheetName: undefined,
      };
    }
    const forceFetch = manualFetchForeignDatasheet && lastFetch.current !== manualFetch.current;
    if (forceFetch) {
      lastFetch.current = manualFetch.current;
    }

    const datasheet = getDatasheetOrLoad(
      state,
      field.property.foreignDatasheetId,
      datasheetId,
      !needIgnoreFetch,
      forceFetch && !needIgnoreFetch,
      !Boolean(mirrorId),
    );
    return {
      foreignSnapshot: datasheet && datasheet.snapshot,
      foreignDatasheetName: datasheet && datasheet.name,
    };
  }, shallowEqual);
  const foreignActiveView = useGetViewByIdWithDefault(field.property.foreignDatasheetId, field.property.limitToView);

  const datasheetLoading = useAppSelector((state) => {
    return Selectors.getDatasheetLoading(state, field.property.foreignDatasheetId);
  });

  const dispatch = useDispatch();

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (editing && e.keyCode === KeyCode.Esc) {
        e.stopImmediatePropagation();
        setEditing(false);
      }
    }

    document.body.addEventListener('keydown', onKeydown);
    return () => {
      document.body.removeEventListener('keydown', onKeydown);
    };
  }, [editing]);

  useImperativeHandle(ref, (): IExpandFieldEditRef => {
    const editor = focusRef.current;
    const noop = () => {
      return;
    };
    if (!editor) {
      return {
        focus: noop,
        setValue: noop,
        saveValue: noop,
      };
    }

    return {
      focus: (preventScroll?: boolean) => {
        editor.focus({ preventScroll });
      },
      setValue: noop,
      saveValue: noop,
    };
  });

  const toggleEditing = useCallback(() => setEditing(false), []);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  function onAddRecord(e: any) {
    if (
      manualFetchForeignDatasheet === FetchForeignTimes.EveryTime ||
      (manualFetchForeignDatasheet === FetchForeignTimes.OnlyOnce && !manualFetch.current)
    ) {
      manualFetch.current = Date.now();
    }
    setEditing(true);
    onClick(e);
    setTimeout(() => {
      if (isMobile) {
        return;
      }
      editorRef.current?.focus();
    });
    // When adding an associated record, load all the records of the associated table for searching
    if (foreignDatasheet?.isPartOfData && !foreignDatasheetErrorCode) {
      if (mirrorId) {
        dispatch(StoreActions.fetchForeignDatasheet(mirrorId, foreignDatasheet.id) as any);
        return;
      }
    }
  }

  function clickRecord(recordId: string) {
    // Determining Related Table Permissions
    const state = store.getState();
    const readable = Selectors.getPermissions(state, field.property.foreignDatasheetId).readable;
    if (!readable && field.property.foreignDatasheetId) {
      Message.warning({
        content: t(Strings.disabled_expand_link_record),
      });
      return;
    }
    expandPreviewModalClose();
    expandRecordInCenter({
      activeRecordId: recordId,
      recordIds: showCellValues.map((recordId) => recordId),
      viewId: foreignActiveView?.id,
      datasheetId: field.property.foreignDatasheetId,
    });
  }

  function deleteRecord(recordId: string) {
    const value = cellValue && cellValue.filter((r) => r !== recordId);
    onSave && onSave(value);
  }

  function renderButton() {
    if ((!editable || field.property.limitSingleRecord) && cellValue && cellValue.length) {
      return <></>;
    }
    return (
      <Button className={style.addLinkRecordBtn} size="small" onClick={onAddRecord} disabled={!editable}>
        <span className={style.inner}>
          {editable && <AddOutlined className={style.addIcon} color={colors.secondLevelText} />}
          {!editable
            ? t(Strings.add_link_record_button_disable)
            : addBtnText || (
              <TComponent
                tkey={t(Strings.add_link_record_button)}
                params={{
                  datasheetname: <span className={style.datasheetName}>{foreignDatasheetName}</span>,
                }}
              />
            )}
        </span>
      </Button>
    );
  }

  const visibleStyle = useCellEditorVisibleStyle({ editing });
  const visibleColumns = Selectors.getVisibleColumnsBase(foreignActiveView);

  return (
    <div className={style.expandLink} style={props.style}>
      {/* This is replaced by an empty element with no width and height to
       avoid unintended scrolling behaviour when the width and height affect its focus */}
      <div ref={focusRef} tabIndex={-1} />
      <div className={style.addLinkRecord}>{renderButton()}</div>
      {foreignSnapshot && (
        <>
          <div className={style.recordList} onMouseDown={(e) => stopPropagation(e)}>
            {showCellValues &&
              showCellValues.map((recordId, index) => {
                const record = foreignSnapshot.recordMap[recordId];

                if (!record) {
                  return <></>;
                }
                return (
                  <ExpandLinkContext.Provider
                    value={{
                      ignoreMirror: true,
                      baseDatasheetId: field.property.foreignDatasheetId,
                    }}
                    key={keyPrefix ? `${keyPrefix}-${index}` : recordId}
                  >
                    <RecordCard
                      className={style.recordCard}
                      record={record}
                      fieldMap={foreignSnapshot.meta.fieldMap}
                      columns={visibleColumns}
                      onClick={clickRecord}
                      onDelete={editable ? deleteRecord : undefined}
                      datasheetId={field.property.foreignDatasheetId}
                    />
                  </ExpandLinkContext.Provider>
                );
              })}
            {hasShowMoreBtn && (
              <div className={style.showMore} onClick={() => setIsShowMoreOpen(true)}>
                <ChevronDownOutlined color={colors.thirdLevelText} />
                <span className={style.showMoreText}>
                  {t(Strings.expand_rest_records_by_count, {
                    record_count: getRestRecordsCount(),
                  })}
                </span>
              </div>
            )}
          </div>
        </>
      )}
      {(datasheetLoading || foreignSnapshot) && (
        <LinkEditor
          {...props}
          ref={editorRef}
          recordId={recordId}
          layout={rightLayout && document.querySelector('.centerExpandRecord') ? LinkEditorModalLayout.CenterRight : LinkEditorModalLayout.Center}
          style={visibleStyle}
          editing={editing}
          loading={datasheetLoading}
          toggleEditing={toggleEditing}
        />
      )}
    </div>
  );
};

export const ExpandLink = memo(forwardRef(ExpandLinkBase));
