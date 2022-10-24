import {
  Api,
  ConfigConstant,
  DATASHEET_ID,
  DatasheetActions,
  getMaxViewCountPerSheet,
  IViewProperty,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { store } from 'pc/store';
import { Modal } from 'pc/components/common';
import { changeView, useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import styles from './style.module.less';
import { ViewIcon } from './view_icon';
import { ViewItem } from './view_item';
import { ViewFilter } from './view_filter';
import classNames from 'classnames';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { useViewAction } from './action';
import { ScreenSize } from 'pc/components/common/component_display';
import { Alert, Button, useThemeColors, IUseListenTriggerInfo, useListenVisualHeight } from '@vikadata/components';
import { useUnmount } from 'ahooks';

interface IViewSwitcherProperty {
  close: (e: React.MouseEvent) => void;
  triggerInfo?: IUseListenTriggerInfo;
}

export const useVerifyOperateItemTitle = (list: any, keyPressEnterCb?: (id: string, value: string) => void) => {
  const [errMsg, setErrMsg] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [editingId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let errorMsg = '';
    // 判断长度是否在1-30之间
    if (value.length < 1 || value.length > 30) {
      errorMsg = t(Strings.view_name_length_err);
    }
    setErrMsg(errorMsg);
    setEditingValue(value);
  };

  const onBlur = () => {
    if (editingId) {
      if (!verifyEditingValue()) {
        return;
      }
      keyPressEnterCb && keyPressEnterCb(editingId, editingValue);
    }
  };

  const onKeyPressEnter = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) {
      stopPropagation(e);
    }
    onBlur();
    setEditingValue('');
    setEditingId('');
  };

  useUnmount(() => {
    onBlur();
  });

  const verifyEditingValue = () => {
    let errorMsg = '';
    const isExitSameName = list.findIndex(item => item.name === editingValue && item.id !== editingId);

    if (isExitSameName !== -1) {
      errorMsg = t(Strings.name_repeat);
    } else if (!editingValue || editingValue.length > 30) {
      errorMsg = t(Strings.view_name_length_err); // '名称要求1~30字符以内';
    }

    if (errorMsg) {
      setErrMsg(errorMsg);
      return false;
    }
    return true;
  };

  return {
    errMsg,
    setErrMsg,
    onChange,
    editingValue,
    setEditingValue,
    editingId,
    setEditingId,
    onKeyPressEnter,
  };
};

export const AddNewViewList: React.FC<{
  addNewViews(e: React.MouseEvent, viewType: ViewType): void;
  style?: React.CSSProperties;
  isMobile?: boolean;
  isViewCountOverLimit?: boolean;
}> = props => {
  const colors = useThemeColors();
  const { addNewViews, style, isMobile, isViewCountOverLimit } = props;
  const btnStyle = {
    ...style,
    color: colors.firstLevelText,
    borderRadius: '4px',
    background: colors.rowSelectedBg,
  };

  return (
    <div className={styles.addNewViewContainer}>
      {!isMobile && <span className={styles.addNewText}>{t(Strings.new_view)}</span>}
      {isViewCountOverLimit && (
        <Alert
          type={'error'}
          content={t(Strings.view_count_over_limit, { count: getMaxViewCountPerSheet() })}
          style={{ padding: 8, margin: '8px 0px' }}
        />
      )}

      <div className={styles.viewTypeContainer}>
        <Button
          className={styles.viewType}
          onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.Grid)}
          style={btnStyle}
          id={DATASHEET_ID.VIEW_LIST_CREATE_GRID_VIEW}
          data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GRID_VIEW}
          disabled={isViewCountOverLimit}
        >
          <div className={classNames('flex item-center', styles.text)}>
            <ViewIcon viewType={ViewType.Grid} />
            <span>{t(Strings.grid_view)}</span>
          </div>
          <AddIcon fill={colors.thirdLevelText} />
        </Button>
        <Button
          className={styles.viewType}
          onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.Gallery)}
          style={btnStyle}
          id={DATASHEET_ID.VIEW_LIST_CREATE_GALLERY_VIEW}
          data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GALLERY_VIEW}
          disabled={isViewCountOverLimit}
        >
          <div className={classNames('flex item-center', styles.text)}>
            <ViewIcon viewType={ViewType.Gallery} fill={colors.primaryColor} />
            <span>{t(Strings.gallery_view)}</span>
          </div>
          <AddIcon fill={colors.thirdLevelText} />
        </Button>
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.Kanban)}
            style={btnStyle}
            id={DATASHEET_ID.VIEW_LIST_CREATE_KANBAN_VIEW}
            data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_KANBAN_VIEW}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Kanban} fill={colors.primaryColor} />
              <span>{t(Strings.kanban_view)}</span>
            </div>
            <AddIcon fill={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.Gantt)}
            style={btnStyle}
            id={DATASHEET_ID.VIEW_LIST_CREATE_GANTT_VIEW}
            data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GANTT_VIEW}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Gantt} fill={colors.primaryColor} />
              <span>{t(Strings.gantt_view)}</span>
            </div>
            <AddIcon fill={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.Calendar)}
            style={btnStyle}
            id={DATASHEET_ID.CREATE_CALENDAR_IN_VIEW_LIST}
            data-test-id={DATASHEET_ID.CREATE_CALENDAR_IN_VIEW_LIST}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Calendar} fill={colors.primaryColor} />
              <span>{t(Strings.calendar_view)}</span>
            </div>
            <AddIcon fill={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={e => addNewViews((e as any) as React.MouseEvent, ViewType.OrgChart)}
            style={btnStyle}
            id={DATASHEET_ID.CREATE_ORG_IN_VIEW_LIST}
            data-test-id={DATASHEET_ID.CREATE_ORG_IN_VIEW_LIST}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.OrgChart} fill={colors.primaryColor} />
              <span>{t(Strings.org_chart_view)}</span>
            </div>
            <AddIcon fill={colors.thirdLevelText} />
          </Button>
        )}
      </div>
    </div>
  );
};

const MIN_HEIGHT = 60;
const MAX_HEIGHT = 340;
export const ViewSwitcher: React.FC<IViewSwitcherProperty> = props => {
  const { close, triggerInfo } = props;
  const activityViewId = useSelector(state => state.pageParams.viewId);
  const { viewCreatable, viewRenamable, viewMovable, viewRemovable, views, datasheetId } = useSelector(state => {
    const { viewCreatable, viewRenamable, viewMovable, viewRemovable } = Selectors.getPermissions(state);

    return {
      viewCreatable,
      viewRenamable,
      viewMovable,
      viewRemovable,
      views: Selectors.getSnapshot(state)!.meta.views,
      datasheetId: state.pageParams.datasheetId,
    };
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    childNode: scrollRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
    position: 'relative-absolute',
  });

  const ViewAction = useViewAction();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const { errMsg, setEditingValue, editingId, setEditingId, onChange, onKeyPressEnter } = useVerifyOperateItemTitle(views, (id, value) => {
    modifyView(id, value);
  });

  // 新增视图
  const addNewViews = (e: React.MouseEvent, viewType: ViewType) => {
    if (!viewCreatable) {
      return;
    }
    // 以下两个恶阻止冒泡事件，旨在点击添加视图时，阻止像组件上层冒泡触发编辑状态的重置以及
    // 上层组件收起来当前组件
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const newView = DatasheetActions.deriveDefaultViewProperty(Selectors.getSnapshot(store.getState())!, viewType, activityViewId);
    ViewAction.addView(newView, views.length);
    switchView(e, newView.id, 'add');
    setEditingId(newView.id);
    setEditingValue(newView.name);
  };

  // 修改视图
  const modifyView = (editingViewId: string, editingViewName: string) => {
    if (!viewRenamable) {
      return;
    }
    if (editingViewName === views.filter(item => item.id === editingViewId)[0].name) {
      return;
    }
    ViewAction.modifyView(editingViewId, editingViewName);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const movingItemId: string = views[source.index]['id'];
    ViewAction.moveView(movingItemId, destination.index);
  };

  // 更改视图
  const switchView = (e: React.MouseEvent, id: string, type?: 'add') => {
    if (activityViewId === id) {
      close(e);
      return;
    }
    changeView(id);
    if (!type) {
      close(e);
    }
  };

  const confirmDelete = (e: React.MouseEvent, currentViewId: string) => {
    if (!viewRemovable) {
      return;
    }
    if (currentViewId === activityViewId) {
      // 如果删除的视图就是当前展示的视图,将激活的视图换到视图列表的其他视图
      if (views.findIndex(item => item.id === currentViewId) === 0) {
        // 删除的视图就是当前第一个视图，则换到第二个
        switchView(e, views[1]['id']);
      } else {
        // 否则换到第一个
        switchView(e, views[0]['id']);
      }
    }
    ViewAction.deleteView(currentViewId);
  };

  const renameEvent = (id: string, name: string) => {
    if (!viewRenamable) {
      return;
    }
    setEditingId(id);
    setEditingValue(name);
  };

  const duplicateView = (viewId: string) => {
    ViewAction.duplicateView(viewId);
  };

  const searchedViews = useMemo(() => {
    return views.filter(view => view.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }, [views, query]);

  const viewLength = views.length;

  const deleteView = async(e: React.MouseEvent, id: string) => {
    const view = views.find(view => view.id === id)!;
    let content = t(Strings.del_view_content, {
      view_name: view.name,
    });
    const [
      formList,
      {
        data: { data: mirrorList },
      },
    ] = await Promise.all([
      StoreActions.fetchForeignFormList(datasheetId!, view.id!),
      Api.getRelateNodeByDstId(datasheetId!, view.id!, ConfigConstant.NodeType.MIRROR),
    ]);
    if (formList?.length > 0) {
      content = t(Strings.notes_delete_the_view_linked_to_form, {
        view_name: view.name,
      });
    }
    if (mirrorList?.length > 0) {
      content = t(Strings.notes_delete_the_view_linked_to_mirror, {
        view_name: view.name,
      });
    }
    Modal.confirm({
      title: t(Strings.delete_view),
      content: content,
      onOk: () => {
        confirmDelete(e, id);
      },
      type: 'danger',
    });
  };

  const commonProps = {
    isEditingId: editingId,
    onInput: onChange,
    onPressEnter: onKeyPressEnter,
    activityViewId,
    switchView,
    confirmDelete: deleteView,
    renameEvent,
    errorMsg: errMsg,
    duplicateView,
    viewLength,
  };

  const searchedViewsLength = searchedViews.length;
  // const viewListWrapperHeight = useMemo(() => {
  //   const itemHeight = 40;
  //   const wrapperHeight = (!query ? viewLength : searchedViewsLength) * itemHeight + 10;

  //   if (wrapperHeight <= minHeight) {
  //     return minHeight;
  //   }
  //   if (wrapperHeight >= maxHeight) {
  //     return maxHeight;
  //   }
  //   return wrapperHeight;
  // }, [viewLength, searchedViewsLength, query]);

  useEffect(() => {
    onListenResize();
  }, [viewLength, searchedViewsLength, query, onListenResize]);

  const isViewCountOverLimit = views.length >= getMaxViewCountPerSheet();
  return (
    <div
      className={styles.viewSwitcherContainer}
      onClick={() => {
        onKeyPressEnter();
      }}
      ref={containerRef}
    >
      {!isMobile && (
        <div className={styles.viewListText}>
          {t(Strings.view_list)}
          <span className={isViewCountOverLimit ? styles.overCount : ''}>
            （{views.length}/{getMaxViewCountPerSheet()}）
          </span>
        </div>
      )}
      <div className={styles.searchField} data-test-id={'viewSearchInput'}>
        <LineSearchInput
          size="default"
          value={query}
          allowClear
          onClear={() => setQuery('')}
          onChange={e => {
            setQuery(e.target.value);
          }}
          placeholder={t(Strings.view_find)}
        />
      </div>
      <div
        className={styles.viewListWrapper}
        // style={{ height: viewListWrapperHeight }}
        style={style}
      >
        {query && <ViewFilter viewsList={searchedViews} {...commonProps} />}
        {!query && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="view-switcher" direction="vertical">
              {provided => {
                return (
                  <div
                    className={styles.droppable}
                    ref={element => {
                      provided.innerRef(element);
                      scrollRef.current = element;
                    }}
                    {...provided.droppableProps}
                  >
                    {views.map((item: IViewProperty, index: number) => {
                      return (
                        <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={!viewMovable}>
                          {providedChild => (
                            <div
                              className={styles.draggable}
                              ref={providedChild.innerRef}
                              {...providedChild.draggableProps}
                              {...providedChild.dragHandleProps}
                            >
                              {
                                <ViewItem
                                  currentViewId={item.id}
                                  currentViewName={item.name}
                                  currentViewIndex={index}
                                  viewType={item.type}
                                  autoSave={item.autoSave}
                                  isViewLock={Boolean(item.lockInfo)}
                                  {...(commonProps as any)}
                                />
                              }
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      {viewCreatable && <AddNewViewList addNewViews={addNewViews} isMobile={isMobile} isViewCountOverLimit={isViewCountOverLimit} />}
    </div>
  );
};
