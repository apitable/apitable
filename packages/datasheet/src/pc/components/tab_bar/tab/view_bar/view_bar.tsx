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

import cls from 'classnames';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { TextButton, useContextMenu } from '@apitable/components';
import { CollaCommandName, DATASHEET_ID, IReduxState, IViewProperty, moveArrayElement, Selectors, Strings, t, ViewType } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Collapse, ICollapseFunc } from 'pc/components/common/collapse';
import { ToolHandleType } from 'pc/components/tool_bar/interface';
import { changeView } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getElementDataset, isPcDevice, KeyCode, stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { Display } from '../../../tool_bar/display/display';
import { TabItem } from '../../tab_item';
import { ContextMenu } from '../conetxt_menu';
import styles from './style.module.less';

// import ReactDOM from 'react-dom';

interface IViewBarProps {
  views: IViewProperty[];
  editIndex: number | null;
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
  switchView: (e: React.MouseEvent, id: string, type?: 'add' | undefined) => void;
  extra?: boolean | JSX.Element;
  className: string;
}

// Default icon occupancy, default + view lock, view front icon, view inner margin, minimum view width without content, edit state width
const DEFAULT_FIXED_WIDTH = 24;
const VIEW_SYNC_ICON_FIXED_WIDTH = 45;
const VIEW_ICON_WIDTH = 20;
const VIEW_PADDING_WIDTH = 20;
const MIN_VIEW_WIDTH = VIEW_SYNC_ICON_FIXED_WIDTH + VIEW_ICON_WIDTH + VIEW_PADDING_WIDTH;
const EDITING_WIDTH = 160;

export const ViewBar: React.FC<React.PropsWithChildren<IViewBarProps>> = (props) => {
  const { views, editIndex, setEditIndex, switchView, extra, className } = props;
  const [viewList, setViewList] = useState(views);
  const datasheetLoading = useAppSelector((state) => Selectors.getDatasheetLoading(state));
  const permissions = useAppSelector((state: IReduxState) => Selectors.getPermissions(state));
  const { datasheetId: activeNodeId, viewId: activeViewId, embedId } = useAppSelector((state) => state.pageParams);
  const folderId = useAppSelector((state) => Selectors.getDatasheetParentId(state));
  const [iconHighlight, setIconHighlight] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [contextMenuIndex, setContextMenuIndex] = useState(-1);
  const [errMsg, setErrMsg] = useState('');
  const collapseRef = useRef<ICollapseFunc | null>(null);
  // const spaceManualSaveViewIsOpen = useAppSelector(state => {
  //   return state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave);
  // });
  const operateViewIds = useAppSelector((state) => {
    return Selectors.getDatasheetClient(state)?.operateViewIds;
  });

  const { contextMenu, onSetContextMenu } = useContextMenu();

  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));

  const handleInputBlur = (e: React.FocusEvent) => {
    if (!errMsg) {
      const inputValue = (e.target as any).value;
      const id = viewList[editIndex!].id;
      modifyView(id, inputValue);
    }
    setEditIndex(null);
    setErrMsg('');
  };

  useEffect(() => {
    if (!views) {
      return;
    }
    let newViews;
    if (embedId && embedInfo.viewControl?.viewId) {
      newViews = views.filter((view) => view.id === embedInfo.viewControl?.viewId);
    } else {
      newViews = views;
    }
    setViewList(newViews);
  }, [views, embedId, embedInfo]);

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    switchView(e, id);
  };

  const handleInputChange = (e: React.ChangeEvent) => {
    const inputValue = (e.target as HTMLInputElement).value.trim();
    const isExitSameName = viewList.findIndex((item) => item.name === inputValue && item.id !== viewList[editIndex!].id);
    if (isExitSameName !== -1) {
      setErrMsg(t(Strings.name_repeat));
      return;
    }
    if (inputValue.length < 1 || inputValue.length > Number(getEnvVariables().VIEW_NAME_MAX_COUNT)) {
      setErrMsg(
        t(Strings.view_name_length_err, {
          maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
        }),
      );
      return;
    }
    setErrMsg('');
    // TODO: Determine if there are duplicate file names
  };

  const handleInputEnter = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      setEditIndex(null);
      return;
    }
    if (e.keyCode !== KeyCode.Enter) {
      return;
    }
    if (errMsg) {
      return;
    }
    const inputValue = (e.target as any).value;
    const id = viewList[editIndex!].id;
    modifyView(id, inputValue);
    setEditIndex(null);
    setErrMsg('');
  };

  const handleItemDbClick = (e: React.MouseEvent) => {
    if (!permissions.viewRenamable) {
      return;
    }
    const box = e.currentTarget;
    const index = parseInt(getElementDataset(box as any, 'index')!, 10);
    setEditIndex(index);
  };

  useEffect(() => {
    const eventBundle = new Map([
      [ShortcutActionName.ViewPrev, prevView],
      [ShortcutActionName.ViewNext, nextView],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  const nextView = () => {
    if (!activeViewId) {
      return;
    }
    const nextViewPos = viewList.findIndex((item) => item.id === activeViewId) + 1;
    if (nextViewPos >= viewList.length) {
      return;
    }
    const nextViewId = viewList[nextViewPos].id;
    changeView(nextViewId);
  };

  const prevView = () => {
    if (!activeViewId) {
      return;
    }
    const prevViewPos = viewList.findIndex((item) => item.id === activeViewId) - 1;
    if (prevViewPos < 0) {
      return;
    }
    const prevViewId = viewList[prevViewPos].id;
    changeView(prevViewId);
  };

  const moveView = (viewId: string, newIndex: number) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.MoveViews,
      data: [
        {
          viewId,
          newIndex,
        },
      ],
    });
  };

  const modifyView = (isEditingId: string, isEditingValue: string) => {
    if (isEditingValue === viewList.filter((item) => item.id === isEditingId)[0].name) {
      return;
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ModifyViews,
      data: [
        {
          viewId: isEditingId,
          key: 'name',
          value: isEditingValue,
        },
      ],
    });
  };

  const handleSortView = (from: number, to: number) => {
    if (to === -1) {
      return;
    }
    const viewId = viewList.filter((_v, i) => i === from)[0].id;
    setViewList((pre) => {
      const list = pre.slice(0);
      moveArrayElement(list, from, to);
      return list;
    });
    moveView(viewId, to);
  };

  const handleHoverTabItem = (index: number) => {
    setHoverIndex(index);
  };

  const renderTriggerDefault = () => {
    const btn = (
      <TextButton
        size="x-small"
        className={styles.viewMoreBtn}
        id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
        data-test-id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
        style={{ fontSize: 14, width: '100%', height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        onClick={stopPropagation}
      >
        {t(Strings.view_count, { count: views.length })}
        <div style={{ marginLeft: 4 }}>
          <ChevronDownOutlined className={cls(styles.viewArrow, { [styles.viewArrowActive]: iconHighlight })} />
        </div>
      </TextButton>
    );

    return (
      <Display
        type={ToolHandleType.ViewSwitcher}
        style={{ width: '558px' }}
        onVisibleChange={(visible) => setIconHighlight(visible)}
        disableAutoActiveItem
      >
        {isPcDevice() ? (
          <Tooltip showTipAnyway offset={[0, 7]} title={t(Strings.view_list)}>
            {btn}
          </Tooltip>
        ) : (
          btn
        )}
      </Display>
    );
  };

  const activeView = viewList.filter((item) => item !== null).filter((v) => v.id === activeViewId)[0];

  // If the space station is not globally enabled for non-cooperative experiments,
  // the view tab bar does not need to display icons and no adjustment is needed in terms of width
  // const getFixedWidth = () => {
  //   if (activeView?.lockInfo) {
  //     return VIEW_SYNC_ICON_FIXED_WIDTH;
  //   }
  //   if (!spaceManualSaveViewIsOpen) {
  //     return DEFAULT_FIXED_WIDTH;
  //   }
  //   if (activeView?.autoSave) {
  //     return VIEW_SYNC_ICON_FIXED_WIDTH;
  //   }
  //   if (operateViewIds?.includes(activeView?.id)) {
  //     return VIEW_SYNC_ICON_FIXED_WIDTH;
  //   }
  //   return DEFAULT_FIXED_WIDTH;
  // };

  // const fixedWidth = getFixedWidth();
  const getShowViewStatus = (item: IViewProperty) => {
    return !!item.lockInfo || item.autoSave || operateViewIds?.includes(item.id);
  };

  let contextMenuId = activeViewId;
  if (contextMenuIndex !== -1) {
    const contextMenuItem = viewList[contextMenuIndex];
    if (contextMenuItem) {
      contextMenuId = contextMenuItem.id;
    }
  }

  return (
    <>
      {viewList.length > 0 && !datasheetLoading && (
        <div className={cls(styles.scrollBox, className, 'scrollBox')}>
          <Collapse
            disabledPopup
            unSortable={!permissions.viewMovable}
            id="view-bar"
            mode={{ fontSize: 13, labelMaxWidth: 156 }}
            activeKey={activeViewId}
            collapseItemClassName={styles.viewBarItem}
            align="flex-start"
            wrapClassName={styles.viewBar}
            ref={collapseRef}
            onSort={handleSortView}
            extra={extra}
            onItemClick={handleItemClick}
            trigger={renderTriggerDefault()}
            stopCalculate={{ width: MIN_VIEW_WIDTH }}
            triggerClassName={{
              normal: cls(styles.trigger, {
                [styles.triggerLastChild]: !extra,
                [styles.specialType]: activeView && [ViewType.OrgChart, ViewType.Kanban].includes(activeView.type),
              }),
            }}
            extraClassName={styles.extra}
            data={viewList
              .filter((item) => item !== null)
              .map((v, index) => {
                const showSyncIcon = getShowViewStatus(v);
                const fixedWidth = permissions.editable ? (!showSyncIcon ? DEFAULT_FIXED_WIDTH : VIEW_SYNC_ICON_FIXED_WIDTH) : 0;
                const editing = index === editIndex;
                return {
                  key: v.id,
                  label: v.name,
                  fixedWidth: fixedWidth + VIEW_ICON_WIDTH + VIEW_PADDING_WIDTH,
                  editing,
                  editingWidth: EDITING_WIDTH + VIEW_PADDING_WIDTH,
                  text: (
                    <TabItem
                      currentViewId={v.id}
                      activeViewId={activeViewId}
                      viewList={viewList}
                      idx={index}
                      hoverIndex={hoverIndex}
                      data={v}
                      errMsg={errMsg}
                      editing={editing}
                      editable={permissions.editable}
                      handleInputBlur={handleInputBlur}
                      handleInputChange={handleInputChange}
                      handleInputEnter={handleInputEnter}
                      onDoubleClick={handleItemDbClick}
                      onHoverTabItem={handleHoverTabItem}
                      showViewStatusIcon={showSyncIcon}
                      onSetContextMenu={onSetContextMenu}
                      onSetContextMenuIndex={setContextMenuIndex}
                    />
                  ),
                };
              })}
          />
        </div>
      )}
      {permissions.editable && (
        <ContextMenu
          activeViewId={contextMenuId}
          activeNodeId={activeNodeId}
          folderId={folderId}
          permissions={permissions}
          viewList={viewList}
          setEditIndex={setEditIndex}
          contextMenu={contextMenu}
        />
      )}
    </>
  );
};
