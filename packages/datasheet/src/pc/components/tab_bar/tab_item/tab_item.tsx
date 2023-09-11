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
import { FC, useEffect, useRef } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IViewProperty, ViewType } from '@apitable/core';
import { MoreOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { ViewLockIcon } from 'pc/components/view_lock/view_lock_icon';
import { stopPropagation } from '../../../utils/dom';
import { ICustomViewProps } from '../tab/tab';
import styles from './style.module.less';

export interface ITabbarItemProps {
  currentViewId: string;
  viewList: ICustomViewProps[] | undefined;
  idx: number;
  data: IViewProperty;
  activeViewId: string | undefined;
  editing: boolean;
  editable: boolean;
  errMsg: string;
  handleInputBlur: (e: React.FocusEvent) => void;
  handleInputChange: (e: React.ChangeEvent) => void;
  handleInputEnter: (e: React.KeyboardEvent) => void;
  handleMouseDown?: (e: React.MouseEvent, id: string) => void;
  onClick?: (e: React.MouseEvent, id: string) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onHoverTabItem: (index: number) => void;
  onSetContextMenu: (e: React.MouseEvent<HTMLElement>, extraInfo: any) => void;
  onSetContextMenuIndex?: (index: number) => void;
  isLastDisplay?: boolean;
  activeIndex?: number;
  displayIndex?: number;
  hoverIndex: number;
  showViewStatusIcon?: boolean;
}

export const TabItem: FC<React.PropsWithChildren<ITabbarItemProps>> = (props) => {
  const {
    editing,
    data,
    editable,
    errMsg,
    activeViewId,
    currentViewId,
    handleInputBlur,
    handleInputChange,
    handleInputEnter,
    viewList,
    idx,
    onClick,
    onDoubleClick,
    onHoverTabItem,
    onSetContextMenu,
    onSetContextMenuIndex,
    activeIndex,
    displayIndex,
    hoverIndex,
    isLastDisplay,
    showViewStatusIcon,
  } = props;
  const colors = useThemeColors();
  const { name, type } = data;
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    // When in edit state, all text in input is selected by default
    if (editing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing, inputRef]);

  if (!viewList) {
    return <></>;
  }

  const index = activeViewId ? viewList.findIndex((item) => item.id === activeViewId) : undefined;
  let isPreActive = false;
  if (activeIndex != null && displayIndex != null) {
    isPreActive = (displayIndex === activeIndex - 1 || displayIndex === hoverIndex - 1) && !isLastDisplay;
  }
  const currentTabActive = activeViewId === currentViewId;
  const itemClass = classNames(
    {
      [styles.tabbarItemWrapper]: true,
      [styles.active]: currentTabActive,
      [styles.err]: errMsg,
      [styles.preActive]: isPreActive,
      [styles.specialType]: [ViewType.OrgChart, ViewType.Kanban].includes(type),
      [styles.tabbarEditting]: editing,
    },
    'tab-view-item',
  );

  function showContextMenu(e: React.MouseEvent<HTMLElement>) {
    onSetContextMenuIndex && onSetContextMenuIndex(idx);
    onSetContextMenu(e, {
      props: {
        tabIndex: idx,
      },
    });
  }

  function onContextMenu(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    showContextMenu(e);
  }

  function handleEnterItem() {
    if (displayIndex != null) {
      onHoverTabItem(displayIndex);
    }
  }

  function handleLeaveItem() {
    onHoverTabItem(-1);
  }

  return (
    <div
      className={itemClass}
      key={currentViewId}
      onMouseDown={(e) => {
        if (onClick) {
          onClick(e, currentViewId);
        }
      }}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      data-test-id={'viewTab'}
      data-index={index}
      data-nid={currentViewId}
      onMouseEnter={handleEnterItem}
      onMouseLeave={handleLeaveItem}
    >
      <div className={styles.lineBorder} />
      {editing ? (
        <Tooltip title={errMsg} visible={Boolean(errMsg)}>
          <input
            className={classNames(styles.inputBox, {
              [styles.lowestBg]: [ViewType.OrgChart, ViewType.Kanban].includes(type),
            })}
            type="text"
            defaultValue={name}
            ref={inputRef}
            autoFocus
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputEnter}
            onDoubleClick={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={stopPropagation}
          />
        </Tooltip>
      ) : (
        <div ref={nameRef} className={styles.sheetName} data-nid={currentViewId} data-index={idx}>
          <ViewIcon size={16} viewType={type} />
          <Tooltip title={name} textEllipsis>
            <span className={styles.name} data-nid={currentViewId} data-index={idx} data-name={name}>
              {name}
            </span>
          </Tooltip>
        </div>
      )}
      {!editing && editable && (
        <div ref={iconRef} className={styles.viewIconArea}>
          {showViewStatusIcon && <ViewLockIcon viewId={currentViewId} view={data} />}
          <div
            className={styles.closeBtn}
            onClick={(e) => {
              stopPropagation(e);
              showContextMenu(e);
            }}
          >
            <div className={styles.circle}>
              <MoreOutlined size={12} color={colors.thirdLevelText} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
