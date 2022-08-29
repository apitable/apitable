import { compensator } from 'compensator';
import { IJOTAction } from 'engine/ot';
import { Strings, t } from 'i18n';
import produce from 'immer';
import { Events, Player } from 'player';
import { AnyAction, combineReducers } from 'redux';
import * as actions from 'store/action_constants';
import {
  IAddDatasheetAction, IChangeViewAction, IComputedInfo, IComputedStatus, IDatasheetMap, IDatasheetPack, IDatasheetState, IJOTActionPayload,
  ILoadedDataPackAction, IRecordNodeDesc, IRecordNodeShared, IRefreshSnapshotAction, IResetDatasheetAction, ISetNodeIcon, IUpdateDatasheetAction,
  IUpdateDatasheetNameAction, IUpdateRevision, IUpdateSnapShotAction
} from 'store/interface';
import { fieldPermissionMap } from 'store/reducers/resource/datasheet/field_permission_map';
import { JOTApply } from '../index';
import { client } from './client';

export const filterDatasheetOp = (state, action: IJOTAction[]) => {
  return action.filter(action => {
    // 过滤评论的 op
    if (action.p[2] === 'comments' && action.p[0] === 'recordMap' && ('li' in action || 'ld' in action)) {
      return false;
    }

    // 当 state 只包含部分数据的时候，要过滤掉对不存在的 record 进行操作的 action
    if (state.isPartOfData) {
      // 如果 p[0] 为 recordMap 则 p[1] 为 recordId
      // 如果 action.p.length > 2 则表示 action 具有 setRecord 的特征
      return !(action.p[0] === 'recordMap' && action.p.length > 2 && !state.snapshot.recordMap[action.p[1]]);
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
    // 只包含部分数据的 payload 不能覆盖包含全部数据的 state
    if (state && action.payload.isPartOfData && !state.isPartOfData) {
      console.log('datasheet with part of data ignored');
      return state;
    }

    // payload 和 state 都包含部分数据，则需要进行合并操作
    if (state && action.payload.isPartOfData && state.isPartOfData) {
      if (action.payload.revision === state.revision) {
        state.snapshot.recordMap = Object.assign({}, action.payload.snapshot.recordMap, state.snapshot.recordMap);
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
});

export const datasheetMap = (
  state: IDatasheetMap = {},
  action: IResetDatasheetAction | IAddDatasheetAction | AnyAction,
): IDatasheetMap => {
  if (!action.datasheetId) {
    return state;
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

const computedInfo = (state: IComputedInfo = {}, action) => {

  if (action.type === actions.SET_DATASHEET_COMPUTED) {
    return action.payload;
  }

  if (action.type === actions.UPDATE_DATASHEET_COMPUTED) {
    compensator.clearAll();
    return { ...state, ...action.payload };
  }

  return state;
};

const computedStatus = (state: IComputedStatus = {}, action) => {

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
    // 兼容旧代码
    if (action.type === actions.SET_DATASHEET_SYNCING) {
      return action.payload;
    }
    return state;
  },
  datasheet,
  client,
  fieldPermissionMap,
  computedInfo,
  computedStatus,
});
