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

import { compensator } from 'compensator';
import { IJOTAction } from 'engine/ot';
import produce from 'immer';
import { fieldPermissionMap } from 'modules/database/store/reducers/resource/datasheet/field_permission_map';
import { AnyAction, combineReducers } from 'redux';
import { Strings, t } from '../../../../../../exports/i18n';
import {
  IAddDatasheetAction,
  IChangeViewAction,
  IComputedInfo,
  IComputedStatus,
  IDatasheetMap,
  IDatasheetPack,
  IDatasheetState,
  IJOTActionPayload,
  ILoadedDataPackAction,
  IRecordNodeDesc,
  IRecordNodeShared,
  IRefreshSnapshotAction,
  IResetDatasheetAction,
  ISetNodeIcon,
  ISetViewPropertyAction,
  IUpdateDatasheetAction,
  IUpdateDatasheetNameAction,
  IUpdateRevision,
  IUpdateSnapShotAction,
} from '../../../../../../exports/store/interfaces';
import { Events, Player } from '../../../../../shared/player';
import * as actions from '../../../../../shared/store/action_constants';
import { JOTApply } from '../index';
import { client } from './client';

export const filterDatasheetOp = (state: IDatasheetState, action: IJOTAction[]) => {
  return action.filter(action => {
    // OPs that filter comments
    if (action.p[2] === 'comments' && action.p[0] === 'recordMap' && ('li' in action || 'ld' in action)) {
      return false;
    }

    // when state only contains part of the data, filter out actions that operate on non-existent records
    if (state.isPartOfData) {
      // if p[0] is recordMap, then p[1] is recordId
      // if action.p.length > 2, then action has setRecord feature
      return !(action.p[0] === 'recordMap' && action.p.length > 2 && !state.snapshot.recordMap[action.p[1]!]);
    }
    return true;
  });
};

type IDatasheetAction = (
    ILoadedDataPackAction |
    IUpdateRevision |
    IJOTActionPayload |
    IChangeViewAction |
    IRecordNodeDesc |
    IRecordNodeShared |
    IUpdateDatasheetNameAction |
    ISetNodeIcon |
    IUpdateDatasheetAction |
    IRefreshSnapshotAction |
    IUpdateSnapShotAction
    ) & { datasheetId: string };

export const datasheet = produce((
  state: IDatasheetState | null = null,
  action: IDatasheetAction,
): IDatasheetState | null => {
  if (action.type === actions.DATAPACK_LOADED) {
    // only include part of the data payload
    // can not cover the state that contains all the data
    if (state && action.payload.isPartOfData && !state.isPartOfData) {
      console.log('datasheet with part of data ignored');
      return state;
    }

    // payload and state include part of the data, then need to merge them
    if (state && action.payload.isPartOfData && state.isPartOfData) {
      if (action.payload.revision === state.revision) {
        state.snapshot.recordMap = Object.assign({}, action.payload.snapshot.recordMap, state.snapshot.recordMap);
        state.snapshot.meta.views = action.payload.snapshot.meta.views;
      } else {
        Player.doTrigger(Events.app_error_logger, {
          error: new Error(t(Strings.error_the_version_is_inconsistent_while_preparing_to_merge)),
          metaData: { name: state.name, id: state.id },
        });
      }
      return state;
    }

    return action.payload;
  }

  if (!state) {
    return null;
  }
  switch (action.type) {
    case actions.REFRESH_SNAPSHOT: {
      state.snapshot = { ...state.snapshot };
      return state;
    }
    case actions.DATASHEET_JOT_ACTION: {
      JOTApply(state, action, filterDatasheetOp);
      return state;
    }
    case actions.DATASHEET_UPDATE_REVISION: {
      state.revision = action.payload;
      return state;
    }
    case actions.CHANGE_VIEW: {
      state.activeView = action.payload;
      return state;
    }
    case actions.RECORD_NODE_DESC: {
      state.description = action.payload;
      return state;
    }
    case actions.SET_NODE_ICON: {
      state.icon = action.payload;
      return state;
    }
    case actions.UPDATE_DATASHEET: {
      state = { ...state, ...action.payload };
      return state;
    }
    case actions.UPDATE_SNAPSHOT: {
      state.snapshot = action.payload;
      return state;
    }
    case actions.RECORD_NODE_SHARED: {
      state.nodeShared = action.payload;
      return state;
    }
    case actions.UPDATE_DATASHEET_NAME: {
      state.name = action.payload;
      return state;
    }
  }
  return state;
}, null);

export const datasheetMap = (
  state: IDatasheetMap = {},
  action: IResetDatasheetAction | IAddDatasheetAction | ISetViewPropertyAction | AnyAction,
): IDatasheetMap => {
  if (!action.datasheetId) {
    return state;
  }
  if (action.type === actions.SET_VIEW_PROPERTY) {
    if (!state[action.datasheetId]) {
      return state;
    }

    const payload = (action as ISetViewPropertyAction).payload;

    return produce(state, draft => {
      const views = draft[action.datasheetId]!.datasheet?.snapshot.meta?.views ?? [];
      const findIndex = views.findIndex(item => item.id === payload.viewId);
      if (findIndex > -1) {
        views.splice(findIndex, 1, payload.viewProperty);
      }
    });
  }
  if (action.type === actions.RESET_DATASHEET) {
    const newState = { ...state };
    delete newState[action.datasheetId];
    return newState;
  }
  if (action.type === actions.ADD_DATASHEET) {
    const newState = { ...state, [action.datasheetId]: (action as IAddDatasheetAction).payload };
    return newState;
  }
  const result = datasheetPack(state[action.datasheetId], action);
  if (result === state[action.datasheetId]) {
    return state;
  }
  return {
    ...state,
    [action.datasheetId]: result,
  };
};

const computedInfo = (state: IComputedInfo = {}, action: AnyAction) => {

  if (action.type === actions.SET_DATASHEET_COMPUTED) {
    return action.payload;
  }

  if (action.type === actions.UPDATE_DATASHEET_COMPUTED) {
    compensator.clearAll();
    return { ...state, ...action.payload };
  }

  return state;
};

const computedStatus = (state: IComputedStatus = {}, action: AnyAction) => {

  if (action.type === actions.SET_DATASHEET_COMPUTED_STATUS) {
    return { ...state, ...action.payload };
  }

  return state;
};

export const datasheetPack = combineReducers<IDatasheetPack>({
  loading: (state = false, action) => {
    if (action.type === actions.DATAPACK_REQUEST) {
      return true;
    }
    if (action.type === actions.DATAPACK_LOADED || action.type === actions.DATASHEET_ERROR_CODE) {
      return false;
    }
    return state;
  },
  connected: (state = false, action) => {
    if (action.type === actions.DATASHEET_CONNECTED) {
      return true;
    }
    return state;
  },
  errorCode: (state = null, action) => {
    if (action.type === actions.DATASHEET_ERROR_CODE) {
      return action.payload;
    }
    if (action.type === actions.DATAPACK_REQUEST || action.type === actions.DATAPACK_LOADED) {
      return null;
    }
    return state;
  },
  syncing: (state = false, action) => {
    // for compatibility
    if (action.type === actions.SET_DATASHEET_SYNCING) {
      return action.payload;
    }
    return state;
  },
  datasheet,
  client: client as any,
  fieldPermissionMap,
  computedInfo,
  computedStatus,
});
