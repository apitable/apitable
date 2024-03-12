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

import { Divider } from 'antd';
import classNames from 'classnames';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual } from 'react-redux';
import { Align } from 'react-window';
import { useThemeColors, Skeleton } from '@apitable/components';
import { ConfigConstant, ILinkField, ILinkIds, IOneWayLinkField, Selectors, Strings, t } from '@apitable/core';
import { CloseCircleOutlined, NarrowOutlined } from '@apitable/icons';
import { JumpIconMode, LinkJump } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation, KeyCode } from 'pc/utils';
import { SearchControl } from '../../common/search_control/search_control';
import { TComponent } from '../../common/t_component/t_component';
import { FocusHolder } from '../focus_holder';
import { useCellEditorVisibleStyle } from '../hooks';
import { IBaseEditorProps, IEditor } from '../interface';
import { SearchContent } from './search_content';
import style from './style.module.less';

export enum LinkEditorModalLayout {
  Center = 'Center',
  CenterRight = 'CenterRight',
}

export interface ILinkEditorProps extends IBaseEditorProps {
  field: ILinkField | IOneWayLinkField;
  recordId: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  cellValue: ILinkIds;
  gridCellEditor?: boolean;
  loading?: boolean;
  toggleEditing?: (next?: boolean) => void;
  layout?: LinkEditorModalLayout;
}

interface ISearchContentRefProps {
  getFilteredRows(): { recordId: string }[];
  scrollToItem(index: number, align?: Align): void;
  saveValue(recordId: string): void;
}

const LinkEditorBase: React.ForwardRefRenderFunction<IEditor, ILinkEditorProps> = (props, ref) => {
  const {
    datasheetId,
    recordId,
    field,
    cellValue,
    toggleEditing: _toggleEditing,
    onSave,
    loading,
    layout = LinkEditorModalLayout.Center,
  } = props;
  const colors = useThemeColors();
  const editing = props.editing;

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        focus();
      },
      onEndEdit: () => {
        onEndEdit();
      },
      onStartEdit: () => {
        return;
      },
      setValue: () => {
        return;
      },
      saveValue: () => {
        return;
      },
    }),
  );

  const editorRef = useRef<{ focus: () => void }>(null);
  const searchContentRef = useRef<ISearchContentRefProps>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [onlyShowSelected, setOnlyShowSelected] = useState<boolean>(false);
  const offsetStyle = useCellEditorVisibleStyle({ editing });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [focusIndex, setFocusIndex] = useState(-1);

  const { foreignDatasheetId, foreignDatasheetName } = useAppSelector((state) => {
    const foreignDatasheet = Selectors.getDatasheet(state, field.property.foreignDatasheetId);
    return { foreignDatasheetId: foreignDatasheet?.id, foreignDatasheetName: foreignDatasheet?.name };
  }, shallowEqual);

  const focus = () => {
    editorRef.current && editorRef.current.focus();
  };

  const toggleEditing = () => {
    if (!foreignDatasheetId && !loading) {
      return;
    }
    _toggleEditing && _toggleEditing();
    if (isMobile) {
      return;
    }
    focus();
  };

  const onClickPortalContainer = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    stopPropagation(e);
    if (e.target === e.currentTarget) {
      toggleEditing();
    }
  };

  const onValueChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const onSwitcherChange = useCallback((checked: boolean) => {
    setOnlyShowSelected(checked);
  }, []);

  const onCancelClick = useCallback(() => {
    setSearchValue('');
  }, []);

  const saveValue = useCallback(
    (value: string[] | null) => {
      onSave && onSave(value);
      if ((field as ILinkField).property.limitSingleRecord) {
        _toggleEditing && _toggleEditing();
      }
    },
    // eslint-disable-next-line
    [field, datasheetId, recordId, editing],
  );

  const onEndEdit = () => {
    // const rows = searchContentRef.current && searchContentRef.current.getFilteredRows();
    // console.log('onSearchSubmit', rows);
  };

  useEffect(() => {
    if (!editing) {
      return setSearchValue('');
    }
    // eslint-disable-next-line
  }, [editing, datasheetId]);

  useEffect(() => {
    if (!searchValue) {
      setFocusIndex(-1);
    }
  }, [datasheetId, recordId, editing, searchValue]);

  if (!foreignDatasheetId && !loading) {
    return <FocusHolder ref={editorRef} />;
  }

  const onKeydown = (e: React.KeyboardEvent) => {
    if (!editing) {
      return;
    }
    if (e.keyCode === KeyCode.Esc) {
      return;
    }
    stopPropagation(e);

    const rows = searchContentRef.current && searchContentRef.current.getFilteredRows();
    if (searchValue && rows) {
      const maxLength = rows.length;
      switch (e.keyCode) {
        case KeyCode.Up:
          const prevIndex = focusIndex <= 0 ? maxLength - 1 : focusIndex - 1;
          setFocusIndex(prevIndex);
          searchContentRef.current && searchContentRef.current.scrollToItem(prevIndex, 'smart');
          return;
        case KeyCode.Down:
          const nextIndex = focusIndex >= maxLength - 1 ? 0 : focusIndex + 1;
          setFocusIndex(nextIndex);
          searchContentRef.current && searchContentRef.current.scrollToItem(nextIndex, 'smart');
          return;
        case KeyCode.Enter:
          const realFocusIndex = focusIndex === -1 ? 0 : focusIndex;
          const recordId = rows[realFocusIndex]?.recordId;
          searchContentRef.current && recordId && searchContentRef.current.saveValue(recordId);
          return;
      }
    }
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if ([KeyCode.Up, KeyCode.Down].includes(e.keyCode)) {
      e.preventDefault();
    }
  };

  const IconClose = isMobile ? CloseCircleOutlined : NarrowOutlined;
  const PortalChild = (
    <div className={classNames(style.linkCard, { [style.rightLayout]: layout === LinkEditorModalLayout.CenterRight })} onKeyDown={onKeydown}>
      <IconClose className={style.iconClose} size={24} color={colors.thirdLevelText} onClick={toggleEditing} />
      {loading ? (
        <div className={style.loadingWrap}>
          <Skeleton />
          <Divider />
          <Skeleton count={2} />
          <Skeleton count={1} width="61%" />
          <Divider />
          <Skeleton count={2} />
          <Skeleton count={1} width="61%" />
        </div>
      ) : (
        <>
          <h2 className={style.linkCardTitle}>
            {foreignDatasheetId && (
              <TComponent
                tkey={t(Strings.function_associate_sheet)}
                params={{
                  datasheetname: (
                    <>
                      「{<span className={style.linkTitle}>{foreignDatasheetName}</span>}」
                      <LinkJump mode={JumpIconMode.Badge} foreignDatasheetId={foreignDatasheetId} />
                    </>
                  ),
                }}
              />
            )}
          </h2>
          <SearchControl
            ref={editorRef}
            onValueChange={onValueChange}
            onSwitcherChange={onSwitcherChange}
            onCancelClick={onCancelClick}
            onkeyDown={onSearchKeyDown}
            placeholder={t(Strings.search_associate_record)}
            checkboxText={t(Strings.check_selected_record)}
            checked={onlyShowSelected}
            value={searchValue}
          />
          {editing && (
            <SearchContent
              ref={searchContentRef}
              field={field}
              cellValue={cellValue}
              searchValue={searchValue}
              onlyShowSelected={onlyShowSelected}
              focusIndex={focusIndex}
              onChange={saveValue}
              datasheetId={datasheetId}
            />
          )}
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {editing && (
          <Popup width="100%" height="90%" open={editing} onClose={toggleEditing} closable={false} className={style.drawerPopup}>
            {PortalChild}
          </Popup>
        )}
      </>
    );
  }

  return ReactDOM.createPortal(
    <div
      style={{
        ...offsetStyle,
        zIndex: document.querySelector('.centerExpandRecord') ? undefined : 1001,
      }}
      onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
      onWheel={stopPropagation}
      onClick={onClickPortalContainer}
      onMouseMove={stopPropagation}
      className={classNames(style.linkEditorPortalContainer, { [ConfigConstant.GIRD_CELL_EDITOR]: props.gridCellEditor })}
      tabIndex={-1}
    >
      {PortalChild}
    </div>,
    document.body,
  );
};

export const LinkEditor = memo(forwardRef(LinkEditorBase));
