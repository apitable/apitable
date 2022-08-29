import { CollaCommandName, DATASHEET_ID, IReduxState, IViewProperty, moveArrayElement, Selectors, Strings, t, ViewType } from '@vikadata/core';
import { ChevronDownOutlined } from '@vikadata/icons';
import { TextButton, useContextMenu } from '@vikadata/components';
import cls from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { ToolHandleType } from 'pc/components/tool_bar/interface';
import { resourceService } from 'pc/resource_service';
import { changeView } from 'pc/hooks';
import { getElementDataset, isPcDevice, KeyCode, stopPropagation } from 'pc/utils';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { TabItem } from '../../tab_item';
import { ContextMenu } from '../conetxt_menu';
import styles from './style.module.less';
import { Display } from '../../../tool_bar/display/display';
import { Collapse, ICollapseFunc } from 'pc/components/common/collapse';
import { Tooltip } from 'pc/components/common';
// import ReactDOM from 'react-dom';

interface IViewBarProps {
  views: IViewProperty[];
  editIndex: number | null;
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
  switchView: (e: React.MouseEvent, id: string, type?: 'add' | undefined) => void;
  extra?: boolean | JSX.Element;
  className: string;
}

// 默认图标占据看度，默认 + 视图锁，视图前置icon，视图内边距，除去内容的最小视图宽度，编辑状态宽度
const DEFAULT_FIXED_WIDTH = 24;
const VIEW_SYNC_ICON_FIXED_WIDTH = 45;
const VIEW_ICON_WIDTH = 20;
const VIEW_PADDING_WIDTH = 20;
const MIN_VIEW_WIDTH = VIEW_SYNC_ICON_FIXED_WIDTH + VIEW_ICON_WIDTH + VIEW_PADDING_WIDTH;
const EDITING_WIDTH = 160;

export const ViewBar: React.FC<IViewBarProps> = props => {
  const { views, editIndex, setEditIndex, switchView, extra, className } = props;
  const [viewList, setViewList] = useState(views);
  const datasheetLoading = useSelector(state => Selectors.getDatasheetLoading(state));
  const permissions = useSelector((state: IReduxState) => Selectors.getPermissions(state));
  const { datasheetId: activeNodeId, viewId: activeViewId } = useSelector(state => state.pageParams);
  const folderId = useSelector(state => Selectors.getDatasheetParentId(state));
  const [iconHighlight, setIconHighlight] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [contextMenuIndex, setContextMenuIndex] = useState(-1);
  // 错误信息
  const [errMsg, setErrMsg] = useState('');
  const collapseRef = useRef<ICollapseFunc | null>(null);
  // const spaceManualSaveViewIsOpen = useSelector(state => {
  //   return state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave);
  // });
  const operateViewIds = useSelector(state => {
    return Selectors.getDatasheetClient(state)?.operateViewIds;
  });

  const { contextMenu, onSetContextMenu } = useContextMenu();

  // input框失去焦点
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
    setViewList(views);
  }, [views]);

  // 鼠标按下
  const handleItemClick = (e: React.MouseEvent, id: string) => {
    switchView(e, id);
  };

  // 输入框内容改变
  const handleInputChange = (e: React.ChangeEvent) => {
    const inputValue = (e.target as HTMLInputElement).value.trim();
    const isExitSameName = viewList.findIndex(
      item => item.name === inputValue && item.id !== viewList[editIndex!].id,
    );
    if (isExitSameName !== -1) {
      // 名称重复
      setErrMsg(t(Strings.name_repeat));
      return;
    }
    // 判断长度是否在1-30之间
    if (inputValue.length < 1 || inputValue.length > 30) {
      setErrMsg(t(Strings.view_name_length_err));
      return;
    }
    setErrMsg('');
    // TODO: 判断文件名是否有重复
  };

  // 输入框按回车
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

  // 双击标签进行重命名
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
    const nextViewPos = viewList.findIndex(item => item.id === activeViewId) + 1;
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
    const prevViewPos = viewList.findIndex(item => item.id === activeViewId) - 1;
    if (prevViewPos < 0) {
      return;
    }
    const prevViewId = viewList[prevViewPos].id;
    changeView(prevViewId);
  };

  // 移动视图
  const moveView = (viewId, newIndex) => {
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

  // 修改视图
  const modifyView = (isEditingId: string, isEditingValue: string) => {
    if (isEditingValue === viewList.filter(item => item.id === isEditingId)[0].name) {
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
    const viewId = viewList.filter((v, i) => i === from)[0].id;
    setViewList(pre => {
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
        {
          isPcDevice() ? (
            <Tooltip showTipAnyway offset={[0, 7]} title={t(Strings.view_list)}>
              {btn}
            </Tooltip>
          ) : btn
        }
      </Display>
    );
  };

  const activeView = viewList.filter(item => item !== null).filter((v) => v.id === activeViewId)[0];

  // 如果空间站全局没有开启不协同的实验功能，则视图标签栏不用显示图标，在宽度方面就不用进行调整
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
  const getShowViewStatus = (item) => {
    return item.lockInfo || item.autoSave || operateViewIds?.includes(item.id);
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
      {
        viewList.length > 0 && !datasheetLoading && (
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
              data={viewList.filter(item => item !== null).map((v, index) => {
                const showSyncIcon = getShowViewStatus(v);
                const fixedWidth = permissions.editable ? !showSyncIcon ? DEFAULT_FIXED_WIDTH : VIEW_SYNC_ICON_FIXED_WIDTH : 0;
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
        )
      }
      {
        permissions.editable && (
          <ContextMenu
            activeViewId={contextMenuId}
            activeNodeId={activeNodeId}
            folderId={folderId}
            permissions={permissions}
            viewList={viewList}
            setEditIndex={setEditIndex}
            contextMenu={contextMenu}
          />
        )
      }
    </>
  );
};
