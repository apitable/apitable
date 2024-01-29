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

import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import * as React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { IViewProperty, Selectors, Strings, t, DatasheetActions, ViewType } from '@apitable/core';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/mobile/modal';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { changeView } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { AddNewViewList } from '../../view_switcher';
import { useViewAction } from '../../view_switcher/action';
import style from '../style.module.less';
import { ActionType, ViewItem } from '../view_item';

interface IViewSwitcherProps {
  onClose: () => void;
}

export const ViewSwitcher: React.FC<React.PropsWithChildren<IViewSwitcherProps>> = (props) => {
  const { viewCreatable, viewRenamable, viewMovable, viewRemovable } = useAppSelector((state) => Selectors.getPermissions(state));

  const views = useAppSelector((state) => {
    const snapshot = Selectors.getSnapshot(state)!;
    return snapshot.meta.views;
  });

  const activeViewId = useAppSelector((state) => state.pageParams.viewId);

  const viewAction = useViewAction();

  const [keyword, setKeyword] = useState('');

  const searchedViews = useMemo(() => {
    if (isEmpty(keyword)) {
      return;
    }
    return views.filter((view) => view.name.includes(keyword));
  }, [views, keyword]);

  const onChange = (actionType: ActionType, view: IViewProperty) => {
    switch (actionType) {
      case ActionType.Duplicate: {
        if (!viewCreatable) {
          return;
        }
        viewAction.duplicateView(view.id);
        break;
      }
      case ActionType.Rename: {
        if (!viewRenamable) {
          return;
        }
        viewAction.modifyView(view.id, view.name);
        break;
      }
      case ActionType.Delete: {
        if (!viewRemovable) {
          return;
        }
        if (view.id === activeViewId) {
          if (views.findIndex((item) => item.id === view.id) === 0) {
            changeView(views[1].id);
          } else {
            changeView(views[0].id);
          }
        }
        viewAction.deleteView(view.id);
        break;
      }
      case ActionType.Add: {
        if (!viewCreatable) {
          return;
        }
        viewAction.addView(view);
        break;
      }
      default: {
        break;
      }
    }
  };

  // TODO: Distinguish between user drag and drop, swipe to delete operations.
  // const [dragStoppable, setDragStoppable] = useState(false);

  const validator = (value: string): boolean => {
    return value.length >= 1 && value.length <= 30;
  };

  const ViewList = views.map((view, index) => {
    return (
      <Draggable draggableId={view.id} index={index} key={view.id} isDragDisabled={!viewMovable}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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

  const SearchedViewList = (searchedViews || []).map((view) => {
    return <ViewItem key={view.id} activeViewId="" view={view} onChange={onChange} draggable={false} onClose={props.onClose} validator={validator} />;
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const movingItemId: string = views[source.index]?.id;
    viewAction.moveView(movingItemId, destination.index);
  };

  const onAddView = (_e: any, viewType: ViewType) => {
    const _view = DatasheetActions.deriveDefaultViewProperty(Selectors.getSnapshot(store.getState())!, viewType, activeViewId);

    onChange(ActionType.Add, _view);
    changeView(_view.id);

    Modal.prompt({
      title: t(Strings.rename),
      defaultValue: _view.name,
      onOk: (value) => {
        if (value === _view.name) {
          return;
        }
        if (!validator(value)) {
          Message.error({
            content: t(Strings.view_name_length_err, {
              maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
            }),
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
          size="large"
          value={keyword}
          allowClear
          onClear={() => setKeyword('')}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t(Strings.view_find)}
        />
      </div>

      <div className={style.main}>
        {!isEmpty(keyword) && SearchedViewList}

        {isEmpty(keyword) && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="view-switcher-mobile" direction="vertical">
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {ViewList}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {viewCreatable && <AddNewViewList addNewViews={onAddView} isMobile />}
      <div className={style.footer} />
    </div>
  );
};
