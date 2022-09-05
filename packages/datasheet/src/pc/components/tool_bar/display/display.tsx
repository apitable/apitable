import { useRef, useCallback, useState, useEffect } from 'react';
import * as React from 'react';
import RcTrigger, { TriggerProps } from 'rc-trigger';
import { ToolHandleType, HideFieldType } from '../interface';
import { ChangeRowHeight } from '../change_row_height';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, StoreActions, Strings, t, ViewType } from '@vikadata/core';
import { IUseListenTriggerInfo } from '@vikadata/components';
import { ViewFilter } from '../view_filter';
import { ViewSort, ViewGroup } from '../view_sort_and_group';
import { HiddenField } from '../hidden_field';
import { ViewSwitcher } from '../view_switcher';
import { SetGalleryLayout } from '../set_gallery_layout';
import { batchActions } from 'redux-batched-actions';
import { useKeyPress } from 'ahooks';
import { useToolbarMenuCardOpen } from '../hooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import styles from './style.module.less';
import { useResponsive } from 'pc/hooks';
import { Popup } from 'pc/components/common/mobile/popup';
import { SetCalendarLayout } from '../set_calendar_layout';
import classNames from 'classnames';
import { expandViewLock } from 'pc/components/view_lock/expand_view_lock';
import { useDisabledOperateWithMirror } from 'pc/components/tool_bar/tool_bar';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { HiddenKanbanGroup } from '../hidden_kanban_group';
import { closeAllExpandRecord } from 'pc/components/expand_record';
import { store } from 'pc/store';

interface IDisplay extends Partial<TriggerProps> {
  style?: React.CSSProperties;
  type: ToolHandleType;
  children: React.ReactElement;
  className?: string;
  onVisibleChange?: (visible: boolean) => void;
  // 当 popup open 时，自动高亮 item 下的 icon 和文字。这个特性默认开启，如果 icon 着色异常请主动关闭
  disableAutoActiveItem?: boolean;
}

const OFFSET = [0, 8];

export const Display: React.FC<IDisplay> = props => {
  const { style, children, type, className, onVisibleChange, disableAutoActiveItem = false } = props;
  const editable = useSelector(state => {
    const permissions = Selectors.getPermissions(state);
    return permissions.visualizationEditable || permissions.editable;
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

  useEffect(() => {
    if (!editable && type !== ToolHandleType.ViewSwitcher) {
      return setAction([]);
    }
    setAction(['click']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  useEffect(() => {
    if (ref.current) {
      const size = (ref.current.getRootDomNode() as HTMLElement).getBoundingClientRect();
      setTriggerInfo({ triggerSize: size, triggerOffset: OFFSET, adjust: false });
    }
  }, [ref]);

  function onMenuVisibleChange(popupVisible: boolean) {
    // 过滤后的行是否有 url 对应的 recordId，没有就关闭记录卡片弹窗
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

    if (disabledToolBarWithMirror) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // 隐藏视图专属的列（如甘特图右侧图形区域的列）
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

      return t(Strings.filter);
    };
    return (
      <>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>{renderNode}</ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <Popup
            title={getTitle(type)}
            className={styles.popupWrapper}
            visible={open}
            onClose={() => onMenuVisibleChange(false)}
            height="90%"
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
