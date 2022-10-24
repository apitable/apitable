import { IViewProperty, ViewType } from '@apitable/core';
import classNames from 'classnames';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { FC, useEffect, useRef } from 'react';
import * as React from 'react';
import IconDot from 'static/icon/common/common_icon_more.svg';
import { ICustomViewProps } from '../tab/tab';
import styles from './style.module.less';
import { stopPropagation } from '../../../utils/dom';
import { Tooltip } from 'pc/components/common';
import { useThemeColors } from '@vikadata/components';
import { ViewLockIcon } from 'pc/components/view_lock/view_lock_icon';

export interface ITabbarItemProps {
  currentViewId: string;
  viewList: ICustomViewProps[] | undefined;
  // 当前item的索引
  idx: number;
  // 当前item的内容
  data: IViewProperty;
  // 当前活动activeViewId
  activeViewId: string | undefined;
  // 是否处于编辑状态
  editing: boolean;
  editable: boolean;
  // 错误消息
  errMsg: string;
  // 输入框失焦
  handleInputBlur: (e: React.FocusEvent) => void;
  // 输入框内容改变
  handleInputChange: (e: React.ChangeEvent) => void;
  // 输入框提交内容
  handleInputEnter: (e: React.KeyboardEvent) => void;
  // 鼠标按下
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
  // 是否展示视图的状态图标
  showViewStatusIcon?: boolean;
}

export const TabItem: FC<ITabbarItemProps> = props => {
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
    showViewStatusIcon
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
    // 当处于编辑状态时，默认选中input中的所有文本
    if (editing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing, inputRef]);

  if (!viewList) {
    return <></>;
  }

  const index = activeViewId ? viewList.findIndex(item => item.id === activeViewId) : undefined;
  let isPreActive = false;
  if (activeIndex != null && displayIndex != null) {
    isPreActive = ((displayIndex === activeIndex - 1) || displayIndex === hoverIndex - 1) && !isLastDisplay;
  }
  const currentTabActive = activeViewId === currentViewId;
  const itemClass = classNames({
    [styles.tabbarItemWrapper]: true,
    [styles.active]: currentTabActive,
    [styles.err]: errMsg,
    [styles.preActive]: isPreActive,
    [styles.specialType]: [ViewType.OrgChart, ViewType.Kanban].includes(type),
    [styles.tabbarEditting]: editing,
  }, 'tab-view-item');

  function showContextMenu(e: React.MouseEvent<HTMLElement>) {
    onSetContextMenuIndex && onSetContextMenuIndex(idx);
    onSetContextMenu(e, {
      props: {
        tabIndex: idx,
      }
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
            onDoubleClick={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onMouseDown={stopPropagation}
          />
        </Tooltip>
      ) : (
        <div ref={nameRef} className={styles.sheetName} data-nid={currentViewId} data-index={idx}>
          <ViewIcon width={16} height={16} viewType={type} onClick={() => { return; }} />
          <Tooltip title={name} textEllipsis>
            <span
              className={styles.name}
              data-nid={currentViewId}
              data-index={idx}
              data-name={name}
            >
              {name}
            </span>
          </Tooltip>
        </div>
      )}
      {!editing && editable &&
        <div ref={iconRef} className={styles.viewIconArea}>
          {showViewStatusIcon && <ViewLockIcon viewId={currentViewId} view={data} />}
          <div
            className={styles.closeBtn}
            onClick={e => {
              stopPropagation(e);
              showContextMenu(e);
            }}
          >
            <div className={styles.circle}>
              <IconDot width={12} height={12} fill={colors.thirdLevelText} />
            </div>
          </div>
        </div>
      }
    </div>
  );
};
