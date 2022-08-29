import { useMemo, useState } from 'react';
import * as React from 'react';
import style from '../style.module.less';
import { IViewProperty, Selectors, Strings, t, DatasheetActions } from '@vikadata/core';
import { useSelector } from 'react-redux';
import { ActionType, ViewItem } from '../view_item';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useViewAction } from '../../view_switcher/action';
import { isEmpty } from 'lodash';
import { changeView } from 'pc/hooks';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { AddNewViewList } from '../../view_switcher';
import { store } from 'pc/store';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/mobile/modal';

interface IViewSwitcherProps {
  onClose: () => void;
}

export const ViewSwitcher: React.FC<IViewSwitcherProps> = props => {

  const {
    viewCreatable,
    viewRenamable,
    viewMovable,
    viewRemovable,
  } = useSelector(state => Selectors.getPermissions(state));

  const views = useSelector(state => {
    const snapshot = Selectors.getSnapshot(state)!;
    return snapshot.meta.views;
  });

  const activeViewId = useSelector(state => state.pageParams.viewId);

  const viewAction = useViewAction();

  const [keyword, setKeyword] = useState('');

  const searchedViews = useMemo(() => {
    if (isEmpty(keyword)) { return; }
    return views.filter(view => view.name.includes(keyword));
  }, [views, keyword]);

  const onChange = (
    actionType: ActionType,
    view: IViewProperty,
  ) => {

    switch (actionType) {
      case ActionType.Duplicate: {
        if (!viewCreatable) { return; }
        viewAction.duplicateView(view.id);
        break;
      }
      case ActionType.Rename: {
        if (!viewRenamable) { return; }
        viewAction.modifyView(view.id, view.name);
        break;
      }
      case ActionType.Delete: {
        if (!viewRemovable) { return; }
        if (view.id === activeViewId) {
          if (views.findIndex(item => item.id === view.id) === 0) {
            changeView(views[1].id);
          } else {
            changeView(views[0].id);
          }
        }
        viewAction.deleteView(view.id);
        break;
      }
      case ActionType.Add: {
        if (!viewCreatable) { return; }
        viewAction.addView(view);
        break;
      }
      default: {
        break;
      }
    }
  };

  // TODO: 区分用户拖拽、滑动删除操作
  // const [dragStoppable, setDragStoppable] = useState(false);

  const validator = (value: string): boolean => {
    return (value.length >= 1 && value.length <= 30);
  };

  const ViewList = views.map((view, index) => {
    return (
      <Draggable
        draggableId={view.id}
        index={index}
        key={view.id}
        isDragDisabled={!viewMovable}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ViewItem
              activeViewId={activeViewId || ''}
              view={view}
              onChange={onChange}
              draggable={viewMovable}
              onClose={props.onClose}
              validator={validator}
            />
          </div>
        )}
      </Draggable>
    );
  });

  const SearchedViewList = (searchedViews || []).map(view => {
    return (
      <ViewItem
        key={view.id}
        activeViewId=''
        view={view}
        onChange={onChange}
        draggable={false}
        onClose={props.onClose}
        validator={validator}
      />
    );
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const movingItemId: string = views[source.index]?.id;
    viewAction.moveView(movingItemId, destination.index);
  };

  const onAddView = (e, viewType) => {
    const _view = DatasheetActions.deriveDefaultViewProperty(
      Selectors.getSnapshot(store.getState())!, viewType, activeViewId,
    );

    onChange(ActionType.Add, _view);
    changeView(_view.id);

    Modal.prompt({
      title: t(Strings.rename),
      defaultValue: _view.name,
      onOk: value => {
        if (value === _view.name) {
          return;
        }
        if (!validator(value)) {
          Message.error({
            content: t(Strings.view_name_length_err),
          });
          return;
        }
        
        onChange(ActionType.Rename, { ..._view, name: value });
      },
    });
  };

  return (
    <div className={style.wrapper}>
      <div className={style.inputWrapper}>
        <LineSearchInput
          size='large'
          value={keyword}
          allowClear
          onClear={() => setKeyword('')}
          onChange={e => setKeyword(e.target.value)}
          placeholder={t(Strings.view_find)}
        />
      </div>

      <div className={style.main}>
        {!isEmpty(keyword) && SearchedViewList}

        {isEmpty(keyword) && <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='view-switcher-mobile' direction="vertical">
            {provided => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {ViewList}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>}
      </div>

      {viewCreatable &&
        <AddNewViewList
          addNewViews={onAddView}
          isMobile
        />
      }
      <div className={style.footer} />
    </div>
  );
};