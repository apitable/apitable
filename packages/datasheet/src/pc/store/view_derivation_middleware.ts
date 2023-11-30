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

import isEqual from 'lodash/isEqual';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { BatchAction } from 'redux-batched-actions';
import {
  ActionConstants,
  IJOTActionPayload,
  Selectors,
  StoreActions,
  ILoadedDataPackAction,
  IReduxState,
  dispatchNewViewDerivation,
  parseAction,
  IListDeleteAction,
  ActionType,
  CollaCommandName,
  effectResourceAction,
  ISetGroupingCollapseAction,
  ViewGroupDerivate,
  IClearActiveRowInfo,
  ISetActiveRowInfo,
  RecordMoveType,
  ViewDerivateGrid,
  ViewDerivateGantt,
  ViewType,
  ITriggerViewDerivationComputed,
  ISetPageParamsAction,
  ICacheTemporaryView,
  ISetSearchKeyword,
  ViewDerivateFactory,
  IChangeViewAction,
} from '@apitable/core';

type IUpdateDerivationAction =
  | BatchAction
  | ILoadedDataPackAction
  | IJOTActionPayload
  | ISetGroupingCollapseAction
  | ISetActiveRowInfo
  | IClearActiveRowInfo
  | ISetPageParamsAction
  | ITriggerViewDerivationComputed
  | StoreActions.ISetMirrorDataAction
  | ICacheTemporaryView
  | ISetSearchKeyword
  | IChangeViewAction;

export const CONST_BATCH_ACTIONS = 'BATCHING_REDUCER.BATCH';
export const viewDerivationMiddleware: Middleware<{}, IReduxState> = (store) => (next) => (action: IUpdateDerivationAction) => {
  next(action);

  if (action.type === CONST_BATCH_ACTIONS) {
    action.payload.forEach((action) => {
      handleAction(store, action);
    });
    return;
  }
  handleAction(store, action);
};

const handleAction = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>, action: IUpdateDerivationAction) => {
  const latestState = store.getState();
  switch (action.type) {
    case ActionConstants.DATAPACK_LOADED: {
      const datasheetId = action.datasheetId;
      if (action.payload.isPartOfData) {
        return;
      }
      if (latestState.pageParams.datasheetId !== datasheetId && datasheetId !== 'previewDatasheet') {
        return;
      }
      dispatchNewViewDerivation(store, datasheetId);
      return;
    }
    case ActionConstants.CHANGE_VIEW: {
      const datasheetId = latestState.pageParams.datasheetId;
      if (!datasheetId) {
        return;
      }
      dispatchNewViewDerivation(store, datasheetId);
      return;
    }
    case ActionConstants.DATASHEET_JOT_ACTION: {
      const operations = action.payload.operations;
      if (operations.find((op) => op.cmd === CollaCommandName.AddViews)) {
        // If you execute the cmd synchronously after the execution, the route viewId is not yet switched
        // The timeout is calculated after the route switch is completed
        setTimeout(() => dispatchNewViewDerivation(store, action.datasheetId));
      } else {
        // Collection of changing viewIds
        const changeViewIds: string[] = [];
        // Changes in cell resources, changes in view configuration require recalculation of ViewDerivation
        const needReCompute = operations.some((op) => {
          const actions = op.actions;
          const hasChange = actions.some((jotAction) => {
            const { type, context } = parseAction(jotAction);
            // delete view - Delete the corresponding view-derived cache.
            if (ActionType.DelView === type) {
              const viewId = (jotAction as IListDeleteAction).ld.id;
              viewId && store.dispatch(StoreActions.deleteViewDerivation(action.datasheetId, viewId));
            }
            if (effectResourceAction(type)) {
              return true;
            }
            if (![ActionType.SetViewProperty, ActionType.MoveRow].includes(type)) {
              return false;
            }
            const state = store.getState();
            const snapshot = Selectors.getSnapshot(state, action.datasheetId);
            if (context.viewIndex === undefined) {
              return false;
            }
            const view = snapshot?.meta.views[context.viewIndex];
            // Collect the changed viewIds and provide them to the widget for change calculation
            view?.id && changeViewIds.push(view.id);
            return view?.id === state.pageParams.viewId;
          });
          return hasChange;
        });
        if (needReCompute) {
          requestAnimationFrame(() => {
            dispatchNewViewDerivation(store, action.datasheetId);
          });
        }
        // TODO: widget
      }
      return;
    }
    case ActionConstants.SET_GROUPING_COLLAPSE: {
      // TODO SET_GROUPING_COLLAPSE triggered too often (toggle search input),
      // the follow-up to see how to optimize off
      const timeStart = Date.now();
      const state = store.getState();
      const viewPrepared = Selectors.getViewDerivatePrepared(state);
      // Since the first load may read the grouped collapsed state dispatch from localStorage to redux,
      // there is no computational cache at this time.
      if (!viewPrepared) {
        return;
      }
      const datasheetId = Selectors.getActiveDatasheetId(state)!;
      const datasheetClientState = Selectors.getDatasheetClient(state)!;
      const viewId = Selectors.getViewIdByNodeId(state, datasheetId)!;
      const pureLinearRows = datasheetClientState.viewDerivation[viewId].pureLinearRows;

      /**
       * TODO: feel this way is not very good, the subsequent thought to optimize the way in the change off.
       * As the search box toggle triggers SET_GROUPING_COLLAPSE, there is no distinction between the view.
       * In some views, there are no pureLinearRows, so here's how to determine.
       */
      if (!pureLinearRows) {
        return;
      }

      const viewGroupDerivate = new ViewGroupDerivate(state, datasheetId);
      const linearRows = viewGroupDerivate.getLinearRowsAndGroupAfterCollapse(pureLinearRows, datasheetClientState.groupingCollapseIds);

      store.dispatch(
        StoreActions.patchViewDerivation(datasheetId, {
          viewId,
          viewDerivation: {
            linearRows,
            linearRowsIndexMap: new Map(linearRows.map((row, index) => [`${row.type}_${row.recordId}`, index])),
          },
        }),
      );
      // console.log('DERIVATE: refreshDerivationByGroupCollapse %s %s cost: %s ms', datasheetId, viewId, Date.now() - timeStart);
      return;
    }
    case ActionConstants.CLEAR_ACTIVE_ROW_INFO:
    case ActionConstants.SET_ACTIVE_ROW_INFO: {
      const state = store.getState();
      const datasheetId = Selectors.getActiveDatasheetId(state)!;
      const datasheetClientState = Selectors.getDatasheetClient(state)!;
      const view = Selectors.getViewInNode(state, datasheetId)!;
      const viewDerivation = datasheetClientState.viewDerivation[view.id];

      if (!viewDerivation || viewDerivation.recordMoveType === RecordMoveType.NotMove) {
        return;
      }

      let viewDerivate: ViewDerivateGrid | ViewDerivateGantt | undefined;
      switch (view.type) {
        case ViewType.Grid: {
          viewDerivate = new ViewDerivateGrid(state, datasheetId);
          break;
        }
        case ViewType.Gantt: {
          viewDerivate = new ViewDerivateGantt(state, datasheetId);
          break;
        }
      }

      if (!viewDerivate || !viewDerivation) {
        return;
      }

      const timeStart = Date.now();
      store.dispatch(
        StoreActions.patchViewDerivation(datasheetId, {
          viewId: view.id,
          viewDerivation: viewDerivate.getViewDerivationPatchByLazySort(view, viewDerivation, datasheetClientState.activeRowInfo),
        }),
      );
      // console.log('DERIVATE: refreshDerivationByActiveRow %s %s cost: %s ms', datasheetId, view.id, Date.now() - timeStart);
      return;
    }
    case ActionConstants.SET_SEARCH_KEYWORD: {
      const datasheetId = action.datasheetId;
      const state = store.getState();
      const view = Selectors.getViewInNode(state, datasheetId)!;
      const visibleRowsWithoutSearch = Selectors.getVisibleRowsWithoutSearch(state, datasheetId, view.id);

      const viewDerivate = ViewDerivateFactory.createViewDerivate(state, datasheetId, view.type);
      const timeStart = Date.now();
      store.dispatch(
        StoreActions.patchViewDerivation(datasheetId, {
          viewId: view.id,
          viewDerivation: viewDerivate.getViewDerivationWithSearch(view, visibleRowsWithoutSearch),
        }),
      );
      // console.log('DERIVATE: refreshDerivationBySearchKeyword %s %s cost: %sms', datasheetId, view.id, Date.now() - timeStart);
      return;
    }
    // Mirror view condition change
    case ActionConstants.CACHE_TEMPORARY_VIEW: {
      const state = store.getState();
      const mirror = Selectors.getMirror(state, action.mirrorId)!;
      dispatchNewViewDerivation(store, mirror.sourceInfo.datasheetId);
      return;
    }
    // Mirroring & Switching between corresponding table-views
    case ActionConstants.SET_PAGE_PARAMS: {
      const state = store.getState();
      const { datasheetId, viewId } = state.pageParams;
      const hasViewDerivation = Selectors.getViewDerivation(state, datasheetId, viewId);

      /**
       * ATTENTION:
       * if there are not exist view derivation, getViewDerivation() will return non-empty object.
       * Do not use the existence of a value as a judgment condition.
       * */
      if (!isEqual(hasViewDerivation, Selectors.EMPTY_DERATION) || !datasheetId || !viewId) {
        return;
      }

      dispatchNewViewDerivation(store, datasheetId);
      return;
    }
    /** Proactive triggering of view-derived data updates */
    case ActionConstants.TRIGGER_VIEW_DERIVATION_COMPUTED: {
      const { datasheetId, viewId } = action.payload;
      dispatchNewViewDerivation(store, datasheetId, viewId);
      return;
    }
    /** mirror pack try to calculate mirror derived data when loading back (for now only when generating mirrors) */
    case ActionConstants.SET_MIRROR_DATA: {
      const { datasheetId, viewId } = action.payload.sourceInfo;
      dispatchNewViewDerivation(store, datasheetId, viewId);
      return;
    }
  }
  return;
};
