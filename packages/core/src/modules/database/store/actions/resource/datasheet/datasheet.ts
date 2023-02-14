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

import {
  fetchDatasheetPack,
  fetchForeignDatasheetPack,
  fetchShareDatasheetPack,
  fetchShareForeignDatasheetPack,
  fetchTemplateDatasheetPack,
  fetchEmbedDatasheetPack,
  fetchEmbedForeignDatasheetPack,
} from '../../../../api/datasheet_api';
import { StatusCode } from 'config';
import { Strings, t } from '../../../../../../exports/i18n';
import { isString } from 'lodash';
import { Events, Player } from '../../../../../shared/player';
import { AnyAction, Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';
import {
  DateUnitType,
  IActiveRowInfo,
  IApiWrapper,
  IDatasheetPack,
  IDragTarget,
  ILoadedDataPackAction,
  ILoadingRecordAction,
  INodeMeta,
  IReduxState,
  IServerDatasheetPack,
  ISetFieldInfoState,
  ISnapshot,
} from '../../../../../../exports/store';
import {
  ACTIVE_EXPORT_VIEW_ID,
  ACTIVE_OPERATE_VIEW_ID,
  ADD_DATASHEET,
  CHANGE_VIEW,
  CHANGE_WIDGET_PANEL_WIDTH,
  CLEAR_ACTIVE_ROW_INFO,
  CLEAR_FIELD_INFO,
  DATAPACK_LOADED,
  DATAPACK_REQUEST,
  DATASHEET_CONNECTED,
  DATASHEET_ERROR_CODE,
  RECORD_NODE_DESC,
  REFRESH_SNAPSHOT,
  RESET_DATASHEET,
  RESET_EXPORT_VIEW_ID,
  RESET_OPERATE_VIEW_ID,
  SET_ACTIVE_FIELD_STATE,
  SET_ACTIVE_ROW_INFO,
  SET_CALENDAR_GRID_WIDTH,
  SET_CALENDAR_SETTING_PANEL_WIDTH,
  SET_CLOSE_SYNC_VIEW_ID,
  SET_DATASHEET_COMPUTED,
  SET_DATASHEET_SYNCING,
  SET_DRAG_TARGET,
  SET_EDIT_STATUS,
  SET_GANTT_DATE_UNIT_TYPE,
  SET_GANTT_GRID_WIDTH,
  SET_GANTT_SETTING_PANEL_WIDTH,
  SET_GRID_VIEW_HOVER_FIELD_ID,
  SET_GROUPING_COLLAPSE,
  SET_HIGHLIGHT_FIELD_ID,
  SET_HOVER_GROUP_PATH,
  SET_HOVER_RECORD_ID,
  SET_HOVER_ROW_OF_ADD_RECORD,
  SET_KANBAN_GROUPING_EXPAND,
  SET_LOADING_RECORD,
  SET_NEW_RECORD_EXPECT_INDEX,
  SET_ORG_CHART_GRID_WIDTH as SET_ORG_CHART_GRID_PANEL_WIDTH,
  SET_ORG_CHART_SETTING_PANEL_WIDTH,
  SET_ROBOT_PANEL_STATUS,
  SET_SEARCH_KEYWORD,
  SET_SEARCH_RESULT_CURSOR_INDEX,
  SWITCH_ACTIVE_PANEL,
  TOGGLE_CALENDAR_GRID,
  TOGGLE_CALENDAR_GUIDE_STATUS,
  TOGGLE_CALENDAR_SETTING_PANEL,
  TOGGLE_GANTT_GRID,
  TOGGLE_GANTT_SETTING_PANEL,
  TOGGLE_KANBAN_GROUP_SETTING_VISIBLE,
  TOGGLE_ORG_CHART_GRID as TOGGLE_ORG_CHART_RIGHT_PANEL,
  TOGGLE_ORG_CHART_GUIDE_STATUS,
  TOGGLE_ORG_CHART_SETTING_PANEL,
  TOGGLE_TIME_MACHINE_PANEL,
  TOGGLE_WIDGET_PANEL,
  UPDATE_DATASHEET,
  UPDATE_DATASHEET_COMPUTED,
  UPDATE_DATASHEET_NAME,
  UPDATE_SNAPSHOT,
} from '../../../../../shared/store/action_constants';
import { deleteNode, loadFieldPermissionMap, updateUnitMap, updateUserMap } from '../../../../../../exports/store/actions';
import { getDatasheet, getDatasheetLoading, getMirror } from '../../../../../../exports/store/selectors';
import { FieldType } from 'types';
import { consistencyCheck } from 'utils';
import produce from 'immer';

// export const applyJOTOperations = (operations: IOperation[], datasheetId: string): IJOTActionPayload => {
//   return {
//     type: JOT_ACTION,
//     payload: { operations },
//     datasheetId,
//   };
// };

export function requestDatasheetPack(datasheetId: string) {
  return {
    type: DATAPACK_REQUEST,
    datasheetId,
  };
}

function consistencyCheckHandle(payload: IServerDatasheetPack, isPartOfData: boolean, getState?: () => IReduxState) {
  if (isPartOfData) {
    return;
  }
  const { snapshot, datasheet } = payload;

  // @su
  // the check of data consistency
  // datasheet is the only object that should be attention
  // if if all the permission of datasheet is ok, no need to check more
  if (!datasheet.permissions?.editable) {
    // when the permission of datasheet is not ok, then check other factors
    const pageParams = getState ? getState().pageParams : {};

    if (!pageParams.mirrorId) {
      return;
    }

    const mirror = getMirror(getState!(), pageParams.mirrorId);

    if (mirror?.sourceInfo.datasheetId !== snapshot.datasheetId) {
      return;
    }

    // mirror's editable permission can go through the original datasheet's permission
    if (!mirror?.permissions.editable) {
      return;
    }
  }

  const errorInfo = consistencyCheck(snapshot);

  if (errorInfo) {
    Player.doTrigger(Events.app_error_logger, {
      error: new Error(t(Strings.error_data_consistency_and_check_the_snapshot)),
      metaData: {
        datasheetId: datasheet.id,
        errorInfo,
      },
    });

    Player.doTrigger(Events.app_modal_confirm, {
      key: 'fixConsistency',
      metaData: {
        datasheetId: datasheet.id,
      },
    });
  }
}

const getActiveViewFromData = (datasheet: INodeMeta, snapshot: ISnapshot, getState?: () => IReduxState) => {
  if (datasheet.activeView) return datasheet.activeView;
  /**
   * by Aria
   * attention, if params.viewId as activeView,
   * will make errors when read foreignDatasheet and activeView,
   * it will point to current opened table, rather than real related table
   */
  if (getState && getState().pageParams.datasheetId === datasheet.id) {
    return getState().pageParams.viewId;
  }
  return snapshot.meta.views[0]!.id;
};

const checkSortInto = (snapshot: ISnapshot) => {
  return produce(snapshot, draft => {
    const views = draft.meta.views;
    for (const v of views) {
      if (Array.isArray(v.sortInfo)) {
        v.sortInfo = {
          keepSort: true,
          rules: v.sortInfo
        };
      }
    }
  });
};

export function receiveDataPack<T extends IServerDatasheetPack = IServerDatasheetPack>(
  payload: T,
  options?: { isPartOfData?: boolean; checkConsistency?: boolean; getState?: () => IReduxState },
): ILoadedDataPackAction {
  const { snapshot, datasheet } = payload;
  const { isPartOfData = false, checkConsistency = true, getState } = options ?? {};

  if (checkConsistency) {
    // TODO: move data consistency check  to node layer, and ensure full recover mechanism
    // check data consistency only when data is editable
    consistencyCheckHandle(payload, isPartOfData, getState);
  }

  return {
    type: DATAPACK_LOADED,
    datasheetId: datasheet.id,
    payload: {
      ...datasheet,
      snapshot: checkSortInto(snapshot),
      isPartOfData,
      activeView: getActiveViewFromData(datasheet, snapshot, getState)!,
    },
  };
}

export const switchView = (datasheetId: string, willActivityViewID: string) => {
  return {
    datasheetId,
    type: CHANGE_VIEW,
    payload: willActivityViewID,
  };
};

export const recordNodeDesc = (datasheetId: string, desc: string) => {
  return {
    type: RECORD_NODE_DESC,
    datasheetId,
    payload: desc,
  };
};

interface IFetchDatasheetSuccess {
  responseBody: IApiWrapper & { data: IServerDatasheetPack };
  datasheetId: string;
  dispatch: Dispatch;
  getState: () => IReduxState;
}

export const fetchDatasheetApi = (datasheetId: string, shareId?: string, templateId?: string, embedId?: string, recordIds?: string | string[]) => {
  let requestMethod = fetchDatasheetPack;
  if (shareId) {
    requestMethod = () => fetchShareDatasheetPack(shareId, datasheetId);
  }
  if (templateId) {
    requestMethod = fetchTemplateDatasheetPack;
  }

  if (embedId) {
    requestMethod = () => fetchEmbedDatasheetPack(embedId, datasheetId);
  }

  return requestMethod(datasheetId, recordIds);
};

export function fetchDatasheet(
  datasheetId: string,
  successCb?: (props?: IFetchDatasheetSuccess) => void,
  overWrite = false,
  extra?: { recordIds: string[] },
  failCb?: () => void,
) {
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const datasheet = getDatasheet(state, datasheetId);
    const { shareId, templateId, embedId } = state.pageParams;
    const { recordIds } = extra || {};
    const datasheetLoading = getDatasheetLoading(state, datasheetId);

    if (datasheetLoading) {
      return;
    }

    if (!datasheet || datasheet.isPartOfData || overWrite) {
      dispatch(requestDatasheetPack(datasheetId));
      return fetchDatasheetApi(datasheetId, shareId, templateId, embedId, recordIds)
        .then(response => {
          if (!response.data.success && state.catalogTree.treeNodesMap[datasheetId]) {
            dispatch(deleteNode({ nodeId: datasheetId, parentId: state.catalogTree.treeNodesMap[datasheetId]!.parentId }));
          }
          return Promise.resolve({ datasheetId, responseBody: response.data, dispatch, getState });
        })
        .catch(e => {
          dispatch(datasheetErrorCode(datasheetId, StatusCode.COMMON_ERR));
          throw e;
        })
        .then(props => {
          // recordIds exits means that only part of recordsIds data is needed @boris
          fetchDatasheetPackSuccess({ ...props, isPartOfData: Boolean(recordIds) });
          props.responseBody.success ? successCb && successCb(props) : failCb && failCb();
        });
    }
    successCb && successCb();
    return;
  };
}

/**
 * in the expanded UI modal that select related records, request this api to get the related table's permission
 * no need to consider templates
 *
 * @param {string} dstId
 * @param {string} foreignDstId
 * @returns {(dispatch: any, getState: () => IReduxState) => (undefined | Promise<void>)}
 */
export function fetchForeignDatasheet(resourceId: string, foreignDstId: string, forceFetch?: boolean) {
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const foreignDatasheet = getDatasheet(state, foreignDstId);
    const { shareId, embedId } = state.pageParams;
    const datasheetLoading = getDatasheetLoading(state, foreignDstId);

    if (datasheetLoading) {
      return;
    }

    let requestMethod = fetchForeignDatasheetPack;
    if (shareId) {
      requestMethod = () => fetchShareForeignDatasheetPack(shareId, resourceId, foreignDstId);
    }

    if (embedId) {
      requestMethod = () => fetchEmbedForeignDatasheetPack(embedId, resourceId, foreignDstId);
    }

    if (forceFetch || !foreignDatasheet || foreignDatasheet.isPartOfData) {
      dispatch(requestDatasheetPack(foreignDstId));
      return requestMethod(resourceId, foreignDstId)
        .then(response => {
          return Promise.resolve({ datasheetId: foreignDstId, responseBody: response.data, dispatch, getState });
        })
        .catch(e => {
          if (state.catalogTree.treeNodesMap[foreignDstId]) {
            dispatch(deleteNode({ nodeId: foreignDstId, parentId: state.catalogTree.treeNodesMap[foreignDstId]!.parentId }));
          }
          dispatch(datasheetErrorCode(foreignDstId, StatusCode.COMMON_ERR));
          throw e;
        })
        .then(props => {
          fetchDatasheetPackSuccess(props);
        });
    }
    return;
  };
}

/**
 * edit the response data that server returns
 * @param data
 */
export const hackData = (data: IServerDatasheetPack): IServerDatasheetPack | undefined => {
  // replace old datetime format
  if (!data) {
    return;
  }
  Object.values(data.snapshot.meta.fieldMap).forEach(field => {
    if (field.type === FieldType.DateTime) {
      if (isString(field.property.dateFormat)) {
        switch (field.property.dateFormat) {
          case 'YYYY/MM/DD':
          case 'yyyy/MM/dd':
            field.property.dateFormat = 0;
            break;
          case 'YYYY-MM-DD':
          case 'yyyy-MM-dd':
            field.property.dateFormat = 1;
            break;
          case 'DD/MM/YYYY':
          case 'dd/MM/yyyy':
            field.property.dateFormat = 2;
            break;
          case 'MM-DD':
          case 'MM-dd':
            field.property.dateFormat = 3;
            break;
          default:
            break;
        }
      }
      if (isString(field.property.timeFormat) && field.property.timeFormat) {
        field.property.includeTime = true;
      }
      field.property.timeFormat = 0;
    }
  });
  return data;
};

interface IFetchDatasheetPack {
  datasheetId: string;
  responseBody: IApiWrapper & { data: IServerDatasheetPack };
  dispatch: Dispatch;
  getState: () => IReduxState;
  isPartOfData?: boolean;
}

export function fetchDatasheetPackSuccess({ datasheetId, responseBody, dispatch, getState, isPartOfData = false }: IFetchDatasheetPack) {
  const data = responseBody.data;

  if (responseBody.success && data) {
    const dispatchActions: AnyAction[] = [];
    if (data.foreignDatasheetMap) {
      Object.keys(data.foreignDatasheetMap).forEach(datasheetPack => {
        const foreignDatasheetPack = data.foreignDatasheetMap![datasheetPack]!;
        dispatchActions.push(receiveDataPack(foreignDatasheetPack, { isPartOfData: true }));
        if (foreignDatasheetPack.fieldPermissionMap) {
          dispatchActions.push(loadFieldPermissionMap(foreignDatasheetPack.fieldPermissionMap, foreignDatasheetPack.datasheet.id));
        }
      });
    }
    if (data.datasheet) {
      dispatchActions.push(receiveDataPack(data, { isPartOfData, getState }));
      if (data.units) {
        // init unityMap, for `member` field use
        const unitMap = {};
        data.units.filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId!] = unit));
        dispatch(updateUnitMap(unitMap));

        // init UserMap, for `CreatedBy`/`LastModifiedBy` field use
        const userMap = {};
        data.units.filter(unit => unit.userId).forEach(user => (userMap[user.userId!] = user));
        dispatch(updateUserMap(userMap));
      }
    }
    if (data.fieldPermissionMap) {
      dispatch(loadFieldPermissionMap(data.fieldPermissionMap, datasheetId));
    }
    dispatch(batchActions(dispatchActions));
  }
  if (!responseBody.success) {
    dispatch(datasheetErrorCode(datasheetId, responseBody.code));
  }
}

export const datasheetErrorCode = (datasheetId: string, code: number | null) => {
  return {
    type: DATASHEET_ERROR_CODE,
    datasheetId,
    payload: code,
  };
};

// set hover(not clicked) state
export const setHoverRecordId = (datasheetId: string, payload: string | null) => {
  return {
    type: SET_HOVER_RECORD_ID,
    datasheetId,
    payload,
  };
};

export const setHoverGroupPath = (datasheetId: string, payload: string | null) => {
  return {
    type: SET_HOVER_GROUP_PATH,
    datasheetId,
    payload,
  };
};

export const setHoverRowOfAddRecord = (datasheetId: string, payload: string | null) => {
  return {
    type: SET_HOVER_ROW_OF_ADD_RECORD,
    datasheetId,
    payload,
  };
};

/**
 *
 * set current operation's row or column (by sky)
 *
 * for rows, operations here only mean unchecked rows, which can drag it directly,
 * if it's multiple rows, the operation data is obtained from recordRanges
 *
 * for columns, similarly, here only save the single column operation, multiple columns data read from fieldRanges
 *
 * @param datasheetId
 * @param payload
 * @returns
 */
export const setDragTarget = (datasheetId: string, payload: IDragTarget) => {
  return {
    type: SET_DRAG_TARGET,
    datasheetId,
    payload,
  };
};

export const setActiveFieldState = (datasheetId: string, payload: ISetFieldInfoState) => {
  return {
    type: SET_ACTIVE_FIELD_STATE,
    datasheetId,
    payload,
  };
};

export const clearActiveFieldState = (datasheetId: string) => {
  return {
    type: CLEAR_FIELD_INFO,
    datasheetId,
  };
};

export const setGroupingCollapse = (datasheetId: string, payload: string[]) => {
  return {
    type: SET_GROUPING_COLLAPSE,
    datasheetId,
    payload,
  };
};

export const setKanbanGroupingExpand = (datasheetId: string, payload: string[]) => {
  return {
    type: SET_KANBAN_GROUPING_EXPAND,
    datasheetId,
    payload,
  };
};

export const toggleKanbanGroupingSettingVisible = (datasheetId: string, payload: boolean) => {
  return {
    type: TOGGLE_KANBAN_GROUP_SETTING_VISIBLE,
    datasheetId,
    payload,
  };
};

export const setEditStatus = (datasheetId: string, payload: { recordId: string; fieldId: string } | null) => {
  return {
    type: SET_EDIT_STATUS,
    datasheetId,
    payload,
  };
};

export const updateDatasheetName = (datasheetId: string, newName: string) => {
  return {
    type: UPDATE_DATASHEET_NAME,
    datasheetId,
    payload: newName,
  };
};

export const setLoadingRecord = (payload: { recordIds: string[]; loading: boolean | 'error' }, datasheetId: string): ILoadingRecordAction => {
  return {
    type: SET_LOADING_RECORD,
    datasheetId,
    payload,
  };
};

export const setDatasheetConnected = (datasheetId: string) => {
  return {
    type: DATASHEET_CONNECTED,
    datasheetId,
  };
};
export const resetDatasheet = (datasheetId: string) => {
  return {
    type: RESET_DATASHEET,
    datasheetId,
  };
};

export const updateDatasheet = (datasheetId: string, datasheet: Partial<INodeMeta>) => {
  return {
    type: UPDATE_DATASHEET,
    datasheetId,
    payload: datasheet,
  };
};

export const updateSnapshot = (datasheetId: string, snapshot: ISnapshot) => {
  return {
    type: UPDATE_SNAPSHOT,
    datasheetId,
    payload: snapshot,
  };
};

export const addDatasheet = (datasheetId: string, datasheetPack: IDatasheetPack) => {
  return {
    type: ADD_DATASHEET,
    datasheetId,
    payload: datasheetPack,
  };
};

export const changeSyncingStatus = (datasheetId: string, status: boolean) => {
  return {
    type: SET_DATASHEET_SYNCING,
    datasheetId,
    payload: status,
  };
};

export const refreshSnapshot = (datasheetId: string) => {
  return {
    type: REFRESH_SNAPSHOT,
    datasheetId,
  };
};

export const setSearchKeyword = (datasheetId: string, keyword: string) => {
  return {
    type: SET_SEARCH_KEYWORD,
    datasheetId,
    payload: keyword,
  };
};

export const setSearchResultCursorIndex = (datasheetId: string, index: number) => {
  return {
    type: SET_SEARCH_RESULT_CURSOR_INDEX,
    datasheetId,
    payload: index,
  };
};

export const setNewRecordExpectIndex = (datasheetId: string, index: number | null) => {
  return {
    type: SET_NEW_RECORD_EXPECT_INDEX,
    datasheetId,
    payload: index,
  };
};

export const setActiveRowInfo = (datasheetId: string, rowInfo: IActiveRowInfo | null) => {
  return {
    type: SET_ACTIVE_ROW_INFO,
    datasheetId,
    payload: rowInfo,
  };
};

export const clearActiveRowInfo = (datasheetId: string) => {
  return {
    type: CLEAR_ACTIVE_ROW_INFO,
    datasheetId,
  };
};

export const toggleGanttGrid = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_GANTT_GRID,
    payload: visible,
    datasheetId,
  };
};

export const setGanttGridWidth = (width: number, datasheetId: string) => {
  return {
    type: SET_GANTT_GRID_WIDTH,
    payload: width,
    datasheetId,
  };
};

export const toggleGanttSettingPanel = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_GANTT_SETTING_PANEL,
    payload: visible,
    datasheetId,
  };
};

export const setGanttSettingPanelWidth = (width: number, datasheetId: string) => {
  return {
    type: SET_GANTT_SETTING_PANEL_WIDTH,
    payload: width,
    datasheetId,
  };
};

export const setGanttDateUnitType = (unitType: DateUnitType, datasheetId: string) => {
  return {
    type: SET_GANTT_DATE_UNIT_TYPE,
    payload: unitType,
    datasheetId,
  };
};

// Calendar actions
export const toggleCalendarGuideStatus = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_CALENDAR_GUIDE_STATUS,
    payload: visible,
    datasheetId,
  };
};
export const toggleCalendarGrid = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_CALENDAR_GRID,
    payload: visible,
    datasheetId,
  };
};

export const setCalendarGridWidth = (width: number, datasheetId: string) => {
  return {
    type: SET_CALENDAR_GRID_WIDTH,
    payload: width,
    datasheetId,
  };
};

export const toggleCalendarSettingPanel = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_CALENDAR_SETTING_PANEL,
    payload: visible,
    datasheetId,
  };
};
export const setCalendarSettingPanelWidth = (width: number, datasheetId: string) => {
  return {
    type: SET_CALENDAR_SETTING_PANEL_WIDTH,
    payload: width,
    datasheetId,
  };
};

// OrgChart view actions
export const toggleOrgChartGuideStatus = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_ORG_CHART_GUIDE_STATUS,
    payload: visible,
    datasheetId,
  };
};
export const toggleOrgChartRightPanel = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_ORG_CHART_RIGHT_PANEL,
    payload: visible,
    datasheetId,
  };
};

export const setOrgChartGridPanel = (width: number, datasheetId: string) => {
  return {
    type: SET_ORG_CHART_GRID_PANEL_WIDTH,
    payload: width,
    datasheetId,
  };
};

export const toggleOrgChartSettingPanel = (visible: boolean, datasheetId: string) => {
  return {
    type: TOGGLE_ORG_CHART_SETTING_PANEL,
    payload: visible,
    datasheetId,
  };
};
export const setOrgChartSettingPanelWidth = (width: number, datasheetId: string) => {
  return {
    type: SET_ORG_CHART_SETTING_PANEL_WIDTH,
    payload: width,
    datasheetId,
  };
};

export const toggleTimeMachinePanel = (datasheetId: string, visible?: boolean) => {
  return {
    type: TOGGLE_TIME_MACHINE_PANEL,
    payload: visible,
    datasheetId,
  };
};

export interface IToggleWidgetPanel {
  type: typeof TOGGLE_WIDGET_PANEL;
}

export interface IChangeWidgetPanelWidth {
  type: typeof CHANGE_WIDGET_PANEL_WIDTH;
  payload: number;
}

export interface ISwitchActivePanel {
  type: typeof SWITCH_ACTIVE_PANEL;
  payload: string;
}

export interface ISetGridViewHoverFieldIdAction {
  type: typeof SET_GRID_VIEW_HOVER_FIELD_ID;
  payload: string | null;
  datasheetId: string;
}

export interface ISetHighlightFieldIdAction {
  type: typeof SET_HIGHLIGHT_FIELD_ID;
  payload: string | null;
  datasheetId: string;
}

export const setGridViewHoverFieldId = (fieldId: string | null, datasheetId: string): ISetGridViewHoverFieldIdAction => {
  return {
    type: SET_GRID_VIEW_HOVER_FIELD_ID,
    payload: fieldId,
    datasheetId,
  };
};

export interface ISetCloseSyncViewIdAction {
  type: typeof SET_CLOSE_SYNC_VIEW_ID;
  payload: string;
  datasheetId: string;
}

export const setCloseSyncViewId = (viewId: string, datasheetId: string): ISetCloseSyncViewIdAction => {
  return {
    type: SET_CLOSE_SYNC_VIEW_ID,
    payload: viewId,
    datasheetId,
  };
};

export const setHighlightFieldId = (fieldId: string | null, datasheetId: string): ISetHighlightFieldIdAction => {
  return {
    type: SET_HIGHLIGHT_FIELD_ID,
    payload: fieldId,
    datasheetId,
  };
};

export const updateDatasheetComputed = (computed: { [key: string]: any }, datasheetId: string) => {
  return {
    type: UPDATE_DATASHEET_COMPUTED,
    payload: computed,
    datasheetId,
  };
};

export const setDatasheetComputed = (computed: { [key: string]: any }, datasheetId: string) => {
  return {
    type: SET_DATASHEET_COMPUTED,
    payload: computed,
    datasheetId,
  };
};

export const setRobotPanelStatus = (status: boolean, datasheetId: string) => {
  return {
    type: SET_ROBOT_PANEL_STATUS,
    payload: status,
    datasheetId,
  };
};

export const activeOperateViewId = (viewId: string, datasheetId: string) => {
  return {
    type: ACTIVE_OPERATE_VIEW_ID,
    payload: viewId,
    datasheetId,
  };
};

export const resetOperateViewId = (viewId: string, datasheetId: string) => {
  return {
    type: RESET_OPERATE_VIEW_ID,
    payload: viewId,
    datasheetId,
  };
};

export const activeExportViewId = (viewId: string, datasheetId: string) => {
  return {
    type: ACTIVE_EXPORT_VIEW_ID,
    payload: viewId,
    datasheetId,
  };
};

export const resetExportViewId = (datasheetId: string) => {
  return {
    type: RESET_EXPORT_VIEW_ID,
    datasheetId,
  };
};
