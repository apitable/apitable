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

import { useRef, useCallback, useState, useEffect } from 'react';
import * as React from 'react';
import RcTrigger, { TriggerProps } from 'rc-trigger';
import { ToolHandleType, HideFieldType } from '../interface';
import { ChangeRowHeight } from '../change_row_height';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, StoreActions, Strings, t, ViewType } from '@apitable/core';
import { IUseListenTriggerInfo } from '@apitable/components';
import { ViewFilter } from '../view_filter';
import { ViewSort, ViewGroup } from '../view_sort_and_group';
import { HiddenField } from '../hidden_field';
import { ViewSwitcher } from '../view_switcher';
import { SetGalleryLayout } from '../set_gallery_layout';
import { batchActions } from 'redux-batched-actions';
import { useKeyPress } from 'ahooks';
import { useDisabledOperateWithMirror, useToolbarMenuCardOpen } from '../hooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import styles from './style.module.less';
import { useResponsive } from 'pc/hooks';
import { Popup } from 'pc/components/common/mobile/popup';
import { SetCalendarLayout } from '../set_calendar_layout';
import classNames from 'classnames';
import { expandViewLock } from 'pc/components/view_lock/expand_view_lock';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { HiddenKanbanGroup } from '../hidden_kanban_group';
import { closeAllExpandRecord } from 'pc/components/expand_record';
import { store } from 'pc/store';
import { Share } from 'pc/components/catalog/share';

interface IDisplay extends Partial<TriggerProps> {
  style?: React.CSSProperties;
  type: ToolHandleType;
  children: React.ReactElement;
  className?: string;
  onVisibleChange?: (visible: boolean) => void;
  // Automatically highlight the icon and text under the item when popup is open. 
  // This feature is enabled by default, please turn it off if the icon coloring is abnormal.
  disableAutoActiveItem?: boolean;
}

const OFFSET = [0, 8];

export const Display: React.FC<IDisplay> = props => {
  const { style, children, type, className, onVisibleChange, disableAutoActiveItem = false } = props;
  const editable = useSelector(state => {
    const permissions = Selectors.getPermissions(state);
    return permissions.visualizationEditable || permissions.editable;
  });
  const canOpenShare = useSelector(state => {
    const permissions = Selectors.getPermissions(state);
    return permissions.editable || permissions.manageable;
  });
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state)!);
  const activeView = useSelector(state => Selectors.getCurrentView(state))!;
  const mirrorId = useSelector(state => state.pageParams.mirrorId);
  const ref = useRef<any>();
  const dispatch = useDispatch();
  const [action, setAction] = useState(['click']);
  const { open, setToolbarMenuCardOpen } = useToolbarMenuCardOpen(type);
  const disabledToolBarWithMirror = useDisabledOperateWithMirror();
  const showViewLockModal = useShowViewLockModal();
  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();
  const activeNodeId = useSelector(state => Selectors.getNodeId(state));

  useEffect(() => {
    if (!editable && type !== ToolHandleType.ViewSwitcher) {
      return setAction([]);
    }
    setAction(['click']);
    // eslint-disable-next-line
  }, [editable]);

  useEffect(() => {
    if (ref.current) {
      const size = (ref.current.getRootDomNode() as HTMLElement).getBoundingClientRect();
      setTriggerInfo({ triggerSize: size, triggerOffset: OFFSET, adjust: false });
    }
  }, [ref]);

  function onMenuVisibleChange(popupVisible: boolean) {
    // If the filtered row has a recordId corresponding to the url, close the record card popup if it doesn't.
    const state = store.getState();
    const visibleRows = Selectors.getVisibleRows(state);
    const recordId = state.pageParams.recordId;
    const hasCurrentRecordId = visibleRows.find(row => row.recordId === recordId);
    if (!popupVisible && type === ToolHandleType.ViewFilter && !hasCurrentRecordId) {
      closeAllExpandRecord();
    }

    if (type !== ToolHandleType.ViewSwitcher && showViewLockModal && !mirrorId) {
      expandViewLock(activeView.id);
      return;
    }

    if (disabledToolBarWithMirror && type !== ToolHandleType.Share) {
      return;
    }

    // Share only people with editable and manageable permissions can open.
    if (type === ToolHandleType.Share && !canOpenShare) {
      return;
    }

    setToolbarMenuCardOpen(popupVisible);
    onVisibleChange && onVisibleChange(popupVisible);
    dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.clearActiveFieldState(datasheetId)]));
  }

  function onHideFieldVisibleChange(popupVisible: boolean) {
    setToolbarMenuCardOpen(popupVisible);
    onVisibleChange && onVisibleChange(popupVisible);
  }

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const close = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) {
        onMenuVisibleChange(false);
        return;
      }
      ref.current && ref.current.close(e);
      // eslint-disable-next-line
    },
    [ref],
  );

  useKeyPress('Esc', event => {
    ref.current && ref.current.close(event);
  });

  function PopupContent() {
    let renderNode = <></>;
    switch (type) {
      case ToolHandleType.ViewSort:
        renderNode = <ViewSort close={close} triggerInfo={triggerInfo} />;
        break;
      case ToolHandleType.ViewSwitcher:
        renderNode = <ViewSwitcher close={close} triggerInfo={triggerInfo} />;
        break;
      case ToolHandleType.HideField:
        renderNode = <HiddenField triggerInfo={triggerInfo} mobileModalclose={onHideFieldVisibleChange} />;
        break;
      case ToolHandleType.HiddenKanbanGroup:
        renderNode = <HiddenKanbanGroup triggerInfo={triggerInfo} />;
        break;
      // Hide columns exclusive to the view (e.g. columns in the graphical area on the right side of the Gantt chart).
      case ToolHandleType.HideExclusiveField:
        renderNode = <HiddenField triggerInfo={triggerInfo} type={HideFieldType.Exclusive} />;
        break;
      case ToolHandleType.ChangeRowHeight:
        renderNode = <ChangeRowHeight triggerInfo={triggerInfo} />;
        break;

      case ToolHandleType.ViewFilter:
        renderNode = <ViewFilter triggerInfo={triggerInfo} />;
        break;
      case ToolHandleType.ViewGroup:
        renderNode = <ViewGroup close={close} triggerInfo={triggerInfo} />;
        break;
      case ToolHandleType.GallerySetting:
        renderNode = <SetGalleryLayout triggerInfo={triggerInfo} />;
        break;
      case ToolHandleType.CalendarSetting:
        renderNode = <SetCalendarLayout />;
        break;
      case ToolHandleType.Share:
        renderNode = <Share nodeId={activeNodeId} isTriggerRender />;
        break;
      default:
        renderNode = <></>;
    }

    const getTitle = (type: ToolHandleType) => {
      if (type === ToolHandleType.HideField) {
        return [ViewType.Kanban, ViewType.Gallery].includes(activeView.type) ? t(Strings.custom_style) : t(Strings.hide_fields);
      }

      if (type === ToolHandleType.ViewSort) {
        return t(Strings.sort);
      }

      if (type === ToolHandleType.HiddenKanbanGroup) {
        return t(Strings.set_grouping);
      }

      if (type === ToolHandleType.Share) {
        return t(Strings.share);
      }

      return t(Strings.filter);
    };
    return (
      <>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>{renderNode}</ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <Popup
            title={getTitle(type)}
            className={styles.popupWrapper}
            open={open}
            onClose={() => onMenuVisibleChange(false)}
            height={type !== ToolHandleType.Share ? '90%' : 'auto'}
            destroyOnClose
          >
            {renderNode}
          </Popup>
        </ComponentDisplay>
      </>
    );
  }

  const onToolItemClick = () => {
    if (!editable) {
      return;
    }
    onMenuVisibleChange(!open);
  };

  const getWidthByType = () => {
    if (type === ToolHandleType.ViewFilter) {
      return 720;
    }
    if (type === ToolHandleType.HideField || type === ToolHandleType.ChangeRowHeight) {
      return 220;
    }
    if (type === ToolHandleType.ViewSort || type === ToolHandleType.ViewGroup) {
      return 470;
    }
    if (type === ToolHandleType.Share) {
      return 528;
    }
    return 200;
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action={action}
          popup={PopupContent()}
          destroyPopupOnHide
          popupAlign={{
            points: ['tl', 'bl'],
            offset: OFFSET,
            overflow: { adjustX: true, adjustY: false },
          }}
          popupStyle={style ? style : { width: getWidthByType() }}
          ref={ref}
          popupVisible={open}
          onPopupVisibleChange={onMenuVisibleChange}
          className={classNames(className, {
            [styles.toolbarItemOpened]: !disableAutoActiveItem && open,
          })}
          mask
        >
          {children}
        </RcTrigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.toolItemWrapper} onClick={onToolItemClick}>
          {children}
        </div>
        {PopupContent()}
      </ComponentDisplay>
    </>
  );
};
