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

import { useKeyPress } from 'ahooks';
import classNames from 'classnames';
import RcTrigger, { TriggerProps } from 'rc-trigger';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { IUseListenTriggerInfo } from '@apitable/components';
import { Selectors, StoreActions, Strings, t, ViewType } from '@apitable/core';
import { Share } from 'pc/components/catalog/share';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { closeAllExpandRecord } from 'pc/components/expand_record';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ChangeRowHeight } from '../change_row_height';
import { HiddenField } from '../hidden_field';
import { HiddenKanbanGroup } from '../hidden_kanban_group';
import { useDisabledOperateWithMirror, useToolbarMenuCardOpen } from '../hooks';
import { HideFieldType, ToolHandleType } from '../interface';
import { SetCalendarLayout } from '../set_calendar_layout';
import { SetGalleryLayout } from '../set_gallery_layout';
import { ViewFilter } from '../view_filter';
import { ViewGroup, ViewSort } from '../view_sort_and_group';
import { ViewSwitcher } from '../view_switcher';
import styles from './style.module.less';

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

export const Display: React.FC<React.PropsWithChildren<IDisplay>> = (props) => {
  const { style, children, type, className, onVisibleChange, disableAutoActiveItem = false } = props;
  const editable = useAppSelector((state) => {
    const permissions = Selectors.getPermissions(state);
    return permissions.visualizationEditable || permissions.editable;
  });
  const canOpenShare = useAppSelector((state) => {
    const permissions = Selectors.getPermissions(state);
    return permissions.editable || permissions.manageable;
  });
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state)!);
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const ref = useRef<any>();
  const dispatch = useDispatch();
  const [action, setAction] = useState(['click']);
  const { open, setToolbarMenuCardOpen } = useToolbarMenuCardOpen(type);
  const disabledToolBarWithMirror = useDisabledOperateWithMirror();
  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));

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

  async function onMenuVisibleChange(popupVisible: boolean): Promise<void> {
    // If the filtered row has a recordId corresponding to the url, close the record card popup if it doesn't.
    const state = store.getState();
    const visibleRows = Selectors.getVisibleRows(state);
    const recordId = state.pageParams.recordId;
    const hasCurrentRecordId = visibleRows.find((row) => row.recordId === recordId);
    if (!popupVisible && type === ToolHandleType.ViewFilter && !hasCurrentRecordId) {
      await closeAllExpandRecord();
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
    async (e: React.MouseEvent) => {
      if (isMobile) {
        await onMenuVisibleChange(false);
        return;
      }
      ref.current && ref.current.close(e);
    },
    // eslint-disable-next-line
    [ref],
  );

  useKeyPress('Esc', (event) => {
    ref.current && ref.current.close(event);
  });

  function PopupContent() {
    let renderNode: JSX.Element;
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
