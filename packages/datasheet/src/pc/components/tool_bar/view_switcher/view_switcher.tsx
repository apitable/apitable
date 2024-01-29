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

import { useUnmount } from 'ahooks';
import classNames from 'classnames';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Alert, Button, useThemeColors, IUseListenTriggerInfo, useListenVisualHeight } from '@apitable/components';
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
import { AddOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { changeView, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { useViewAction } from './action';
import { ViewFilter } from './view_filter';
import { ViewIcon } from './view_icon';
import { ViewItem } from './view_item';
import styles from './style.module.less';

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
    // Determine if the length is between 1 and 30.
    if (value.length < 1 || value.length > Number(getEnvVariables().VIEW_NAME_MAX_COUNT)) {
      errorMsg = t(Strings.view_name_length_err, {
        maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
      });
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
    const isExitSameName = list.findIndex((item: any) => item.name === editingValue && item.id !== editingId);

    if (isExitSameName !== -1) {
      errorMsg = t(Strings.name_repeat);
    } else if (!editingValue || editingValue.length > Number(getEnvVariables().VIEW_NAME_MAX_COUNT)) {
      errorMsg = t(Strings.view_name_length_err, {
        maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
      }); // Name requirement within 1~30 characters.
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

export const AddNewViewList: React.FC<
  React.PropsWithChildren<{
    addNewViews(e: React.MouseEvent, viewType: ViewType): void;
    style?: React.CSSProperties;
    isMobile?: boolean;
    isViewCountOverLimit?: boolean;
  }>
> = (props) => {
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
          onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.Grid)}
          style={btnStyle}
          id={DATASHEET_ID.VIEW_LIST_CREATE_GRID_VIEW}
          data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GRID_VIEW}
          disabled={isViewCountOverLimit}
        >
          <div className={classNames('flex item-center', styles.text)}>
            <ViewIcon viewType={ViewType.Grid} />
            <span>{t(Strings.grid_view)}</span>
          </div>
          <AddOutlined color={colors.thirdLevelText} />
        </Button>
        <Button
          className={styles.viewType}
          onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.Gallery)}
          style={btnStyle}
          id={DATASHEET_ID.VIEW_LIST_CREATE_GALLERY_VIEW}
          data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GALLERY_VIEW}
          disabled={isViewCountOverLimit}
        >
          <div className={classNames('flex item-center', styles.text)}>
            <ViewIcon viewType={ViewType.Gallery} color={colors.primaryColor} />
            <span>{t(Strings.gallery_view)}</span>
          </div>
          <AddOutlined color={colors.thirdLevelText} />
        </Button>
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.Kanban)}
            style={btnStyle}
            id={DATASHEET_ID.VIEW_LIST_CREATE_KANBAN_VIEW}
            data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_KANBAN_VIEW}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Kanban} color={colors.primaryColor} />
              <span>{t(Strings.kanban_view)}</span>
            </div>
            <AddOutlined color={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.Gantt)}
            style={btnStyle}
            id={DATASHEET_ID.VIEW_LIST_CREATE_GANTT_VIEW}
            data-test-id={DATASHEET_ID.VIEW_LIST_CREATE_GANTT_VIEW}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Gantt} color={colors.primaryColor} />
              <span>{t(Strings.gantt_view)}</span>
            </div>
            <AddOutlined color={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.Calendar)}
            style={btnStyle}
            id={DATASHEET_ID.CREATE_CALENDAR_IN_VIEW_LIST}
            data-test-id={DATASHEET_ID.CREATE_CALENDAR_IN_VIEW_LIST}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.Calendar} color={colors.primaryColor} />
              <span>{t(Strings.calendar_view)}</span>
            </div>
            <AddOutlined color={colors.thirdLevelText} />
          </Button>
        )}
        {!isMobile && (
          <Button
            className={styles.viewType}
            onClick={(e) => addNewViews(e as any as React.MouseEvent, ViewType.OrgChart)}
            style={btnStyle}
            id={DATASHEET_ID.CREATE_ORG_IN_VIEW_LIST}
            data-test-id={DATASHEET_ID.CREATE_ORG_IN_VIEW_LIST}
            disabled={isViewCountOverLimit}
          >
            <div className={classNames('flex item-center', styles.text)}>
              <ViewIcon viewType={ViewType.OrgChart} color={colors.primaryColor} />
              <span>{t(Strings.org_chart_view)}</span>
            </div>
            <AddOutlined color={colors.thirdLevelText} />
          </Button>
        )}
      </div>
    </div>
  );
};

const MIN_HEIGHT = 60;
const MAX_HEIGHT = 340;
export const ViewSwitcher: React.FC<React.PropsWithChildren<IViewSwitcherProperty>> = (props) => {
  const { close, triggerInfo } = props;
  const activityViewId = useAppSelector((state) => state.pageParams.viewId);
  const { viewCreatable, viewRenamable, viewMovable, viewRemovable, views, datasheetId } = useAppSelector((state) => {
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

  const addNewViews = (e: React.MouseEvent, viewType: ViewType) => {
    if (!viewCreatable) {
      return;
    }
    // The following two block bubble events are designed to prevent the upper level bubble
    // like component from triggering a reset of the edit state and the upper level component from putting away
    // the current component when clicking Add View.
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const newView = DatasheetActions.deriveDefaultViewProperty(Selectors.getSnapshot(store.getState())!, viewType, activityViewId);
    ViewAction.addView(newView, views.length);
    switchView(e, newView.id, 'add');
    setEditingId(newView.id);
    setEditingValue(newView.name);
  };

  // Modify view.
  const modifyView = (editingViewId: string, editingViewName: string) => {
    if (!viewRenamable) {
      return;
    }
    if (editingViewName === views.filter((item) => item.id === editingViewId)[0].name) {
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

  // Modify view.
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
      // If the deleted view is the currently displayed view, switch the active view to another view in the view list.
      if (views.findIndex((item) => item.id === currentViewId) === 0) {
        // The deleted view is the current first view, then switch to the second.
        switchView(e, views[1]['id']);
      } else {
        // Otherwise switch to the first.
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
    return views.filter((view) => view.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }, [views, query]);

  const viewLength = views.length;

  const deleteView = async (e: React.MouseEvent, id: string) => {
    const view = views.find((view) => view.id === id)!;
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
          onChange={(e) => {
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
              {(provided) => {
                return (
                  <div
                    className={styles.droppable}
                    ref={(element) => {
                      provided.innerRef(element);
                      scrollRef.current = element;
                    }}
                    {...provided.droppableProps}
                  >
                    {views.map((item: IViewProperty, index: number) => {
                      return (
                        <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={!viewMovable}>
                          {(providedChild) => (
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
