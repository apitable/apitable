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

import get from 'lodash/get';
import createCachedSelector from 're-reselect';
import { GanttRowHeight, NotSupportFieldInstance, PREVIEW_DATASHEET_ID, RowHeightLevel } from '../../../../../shared/store/constants';
import {
  IDatasheetState,
  IFieldPermissionMap,
  IMirror,
  INetworking,
  INodeDescription,
  IReduxState,
  ISnapshot,
  IViewProperty,
  Role,
} from '../../../../../../exports/store/interfaces';
import { gridViewDragStateDefault } from 'modules/database/store/reducers/resource/datasheet/grid_view_drag';
import { gridViewActiveFieldStateDefault } from 'modules/database/store/reducers/resource/datasheet/grid_view_active_field';
import { getMirror } from 'modules/database/store/selectors/resource/mirror';

const defaultKeySelector = (state: IReduxState, datasheetId: string | undefined | void) => datasheetId || getNodeId(state);

export const getDatasheetPrimaryField = (snapshot: ISnapshot) => {
  const firstView = snapshot.meta.views[0]!;
  const firstColumn = firstView.columns[0]!;
  const fieldMap = snapshot.meta.fieldMap;
  return fieldMap[firstColumn.fieldId];
};

/**
 * get a datasheet pack,
 * a datasheet pack contains the state information of the datasheet (loading, etc.),
 * the basic snapshot data, and the calculated information after calculation
 * @param state
 * @param id
 * @returns
 */
export const getDatasheetPack = (state: IReduxState, id?: string | void) => {
  const datasheetId = id || state.pageParams?.datasheetId;
  if (!datasheetId) {
    return;
  }
  // if no specify datasheet id, and have snapshot preview data, use preview data for render
  if (!id && state.datasheetMap[PREVIEW_DATASHEET_ID]) {
    return state.datasheetMap[PREVIEW_DATASHEET_ID];
  }

  return state.datasheetMap[datasheetId];
};

/**
 * get the snapshot of datasheet
 * @param state
 * @param id
 * @returns
 */
export const getDatasheet = (state: IReduxState, id?: string | void): IDatasheetState | null | undefined => {
  const datasheetPack = getDatasheetPack(state, id);
  return datasheetPack && datasheetPack.datasheet;
};

export const getRecordHistoryStatus = (state: IReduxState, id?: string): boolean => {
  const datasheetId = id || state.pageParams.datasheetId;
  if (!datasheetId) {
    return false;
  }

  return get(state, `datasheetMap.${datasheetId}.datasheet.extra.showRecordHistory`, false);
};

export const getDatasheetRole = (state: IReduxState, id?: string): string | undefined => {
  const datasheetId = id || state.pageParams.datasheetId;
  if (!datasheetId) {
    return;
  }

  return get(state, `datasheetMap.${datasheetId}.datasheet.role`);
};

export const getDatasheetNetworking = (state: IReduxState, id?: string): INetworking | undefined => {
  const datasheetPack = getDatasheetPack(state, id);
  if (!datasheetPack) {
    return;
  }
  return {
    loading: datasheetPack.loading,
    connected: datasheetPack.connected,
    syncing: datasheetPack.syncing,
    errorCode: datasheetPack.errorCode,
  };
};

export const getDatasheetLoading = (state: IReduxState, id?: string) => {
  return getDatasheetNetworking(state, id)?.loading;
};

export const getDatasheetErrorCode = (state: IReduxState, id?: string) => {
  return getDatasheetNetworking(state, id)?.errorCode;
};

export const getDatasheetConnected = (state: IReduxState, id?: string) => {
  return getDatasheetNetworking(state, id)?.connected;
};

export const getDatasheetClient = (state: IReduxState, id?: string | void) => {
  const datasheetPack = getDatasheetPack(state, id);
  return datasheetPack?.client;
};

export const getSnapshot = (state: IReduxState, id?: string | void): ISnapshot | undefined => {
  const datasheet = getDatasheet(state, id);
  return datasheet?.snapshot;
};

export const getActiveDatasheetId = (state: IReduxState) => {
  return state.pageParams.datasheetId;
};

export const getHighlightFieldId = (state: IReduxState, id?: string) => {
  const datasheetPack = getDatasheetPack(state, id);
  return datasheetPack?.client?.highlightFiledId;
};

// get current datasheet's column permission
export const getFieldPermissionMapBase = (state: IReduxState, id?: string | void): IFieldPermissionMap | undefined => {
  const datasheetPack = getDatasheetPack(state, id);
  return datasheetPack?.fieldPermissionMap;
};

export const getFieldPermissionMap = createCachedSelector<
  IReduxState,
  string | undefined | void,
  IFieldPermissionMap | undefined,
  IViewProperty | undefined,
  string | undefined | void,
  IFieldPermissionMap | undefined
>(
  [
    getFieldPermissionMapBase,
    (state) => {
      const snapshot = getSnapshot(state)!;
      return getViewById(snapshot, state.pageParams?.viewId || '');
    },
    (state) => state.pageParams?.mirrorId,
  ],

  (fieldPermissionMap: IFieldPermissionMap | undefined, view: IViewProperty | undefined, mirrorId?: string | void) => {
    if (!mirrorId) {
      return fieldPermissionMap;
    }
    if (mirrorId && view && typeof view.displayHiddenColumnWithinMirror === 'boolean' && !view.displayHiddenColumnWithinMirror) {
      const _fieldPermissionMap = {};
      for (const v of view.columns) {
        if (!v.hidden) continue;
        _fieldPermissionMap[v.fieldId] = {
          role: Role.None,
          setting: {
            formSheetAccessible: true,
          },
          permission: {
            editable: false,
            readable: false,
          },
          manageable: false,
        };
      }
      return {
        ...fieldPermissionMap,
        ..._fieldPermissionMap,
      };
    }
    return fieldPermissionMap;
  }
)(defaultKeySelector);

export const getFieldRoleByFieldId = (fieldPermissionMap: IFieldPermissionMap | undefined, fieldId: string): null | Role => {
  if (!fieldPermissionMap || !fieldPermissionMap[fieldId]) {
    return null;
  }
  const role = fieldPermissionMap[fieldId]!.role;
  return role || Role.None;
};

export const getFormSheetAccessibleByFieldId = (fieldPermissionMap: IFieldPermissionMap | undefined, fieldId: string) => {
  if (!fieldPermissionMap || !fieldPermissionMap[fieldId]) {
    return true;
  }
  return fieldPermissionMap[fieldId]!.setting.formSheetAccessible;
};

export const getSearchKeyword = (state: IReduxState, dstId?: string | void): string | undefined => {
  const dstClient = getDatasheetClient(state, dstId);
  return dstClient?.searchKeyword;
};

export const getActiveRowInfo = (state: IReduxState, dstId?: string) => {
  const dstClient = getDatasheetClient(state, dstId);
  return dstClient?.activeRowInfo;
};

export const getIsSearching = (state: IReduxState, dstId?: string): boolean => {
  const dstClient = getDatasheetClient(state, dstId);
  return Boolean(dstClient?.searchKeyword);
};

export const getActiveCell = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  const activeCell = client && client.selection && client.selection.activeCell;
  return activeCell ? activeCell : null;
};

export const getActiveRecordId = (state: IReduxState) => {
  const activeCell = getActiveCell(state);
  return activeCell?.recordId;
};

export const getSearchResultCursorIndex = (state: IReduxState, dstId?: string): number | undefined => {
  const dstClient = getDatasheetClient(state, dstId);
  return dstClient?.searchResultCursorIndex;
};

export const getGridViewDragState = (state: IReduxState, id?: string) => {
  const client = getDatasheetClient(state, id);
  return client ? client.gridViewDragState : gridViewDragStateDefault;
};

export const getGridViewHoverFieldId = (state: IReduxState, id?: string) => {
  const client = getDatasheetClient(state, id);
  return client ? client.gridViewHoverFieldId : null;
};

export const gridViewActiveFieldState = (state: IReduxState, id?: string) => {
  const client = getDatasheetClient(state, id);
  return client ? client.gridViewActiveFieldState : gridViewActiveFieldStateDefault;
};

export const getGroupingCollapseIds = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  return client && client.groupingCollapseIds;
};

export const getKanbanGroupCollapse = (state: IReduxState) => {
  const client = getDatasheetClient(state);
  if (!client || !client.kanbanGroupCollapse) {
    return [];
  }
  return client.kanbanGroupCollapse;
};

export const getEditingCell = (state: IReduxState) => {
  const client = getDatasheetClient(state);
  if (!client || !client.isEditingCell) {
    return null;
  }
  return client.isEditingCell;
};

export const getNodeDesc = (state: IReduxState, dsId?: string): null | INodeDescription => {
  const datasheet = getDatasheet(state, dsId);
  if (!datasheet || !datasheet.description) {
    return null;
  }
  try {
    return JSON.parse(datasheet.description);
  } catch (e) {
    return null;
  }
};

export const getAutomationNodeDesc = (state: IReduxState, dsId?: string): null | INodeDescription => {
  const datasheet = getDatasheet(state, dsId);
  if (!datasheet || !datasheet.description) {
    return null;
  }
  return JSON.parse(datasheet.description);
};

export const getRecord = (state: IReduxState, recordId: string, datasheetId?: string) => {
  const snapshot = getSnapshot(state, datasheetId)!;
  return snapshot.recordMap[recordId];
};

export const getField = (state: IReduxState, fieldId: string, datasheetId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  if (!snapshot) {
    return NotSupportFieldInstance;
  }
  return snapshot.meta.fieldMap[fieldId] || NotSupportFieldInstance;
};

export const getViewsList = (state: IReduxState, dsId?: string) => {
  const snapshot = getSnapshot(state, dsId)!;
  return snapshot.meta.views;
};

export const getNodeId = (state: IReduxState) => {
  const { mirrorId, nodeId } = state.pageParams;
  // mirror is special,  url will contain mirrorId and datasheetId at the same time, so mirrorId need to be judged first
  if (mirrorId) {
    return mirrorId;
  }

  return nodeId || '';
};

export const getActiveNodePrivate = (state: IReduxState) => {
  const nodeId = getNodeId(state);
  return state.datasheetMap[nodeId]?.datasheet?.nodePrivate;
};

export const getToolbarMenuCardState = (state: IReduxState) => {
  return state.toolbar.menuCardState;
};

export const getLinkId = (state: IReduxState) => {
  const pageParams = state.pageParams;
  return pageParams.templateId || pageParams.shareId || pageParams.embedId;
};

export const allowShowCommentPane = (state: IReduxState) => {
  const spaceId = state.space.activeId;
  const linkId = getLinkId(state);
  const embedId = state.pageParams.embedId;

  return Boolean(spaceId && !linkId) || Boolean(spaceId && embedId);
};

export const getDatasheetParentId = (state: IReduxState, id?: string) => {
  const datasheet = getDatasheet(state, id);
  if (!datasheet) {
    return;
  }
  const nodePrivate = datasheet.nodePrivate;
  const tree = state.catalogTree[nodePrivate ? 'privateTreeNodesMap' : 'treeNodesMap'];
  return tree[datasheet.id]?.parentId || datasheet.parentId;
};

export const getWidgetPanels = (state: IReduxState, datasheetId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  return snapshot && snapshot.meta.widgetPanels;
};

export const getWidgetPanelStatus = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  return client?.widgetPanelStatus;
};

export const getGanttRowHeightFromLevel = (level?: RowHeightLevel): number => {
  return level == null ? GanttRowHeight.Short : GanttRowHeight[RowHeightLevel[level]!];
};

export const getGanttViewStatus = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  return client?.ganttViewStatus;
};

export const getGanttSettingPanelVisible = (state: IReduxState, datasheetId?: string) => {
  const ganttViewStatus = getGanttViewStatus(state, datasheetId)!;
  return ganttViewStatus.settingPanelVisible;
};

export const getActiveViewId = (state: IReduxState, id?: string | void) => {
  const datasheet = getDatasheet(state, id);
  const views = datasheet?.snapshot.meta.views;
  const pageViewId = state.pageParams.viewId;
  if (!views) {
    return pageViewId;
  }
  if (!views.find((item) => item.id === pageViewId)) {
    return views[0]?.id;
  }
  return pageViewId;
};

export const getActiveView = (state: IReduxState, id?: string | void) => {
  const datasheet = getDatasheet(state, id);
  const views = datasheet?.snapshot.meta.views;
  const pageViewId = state.pageParams.viewId;
  if (views) {
    const view = views.find((item) => item.id === pageViewId);
    if (view) {
      return view;
    }
  }
  return null;
};

export const getViewIdByNodeId = (state: IReduxState, datasheetId: string, viewId?: string, mirror?: IMirror) => {
  const _mirror = mirror || getMirror(state);
  const _viewId = viewId ?? state.pageParams.viewId;
  const isMirrorView = _mirror && _mirror.sourceInfo.datasheetId === datasheetId && _mirror.sourceInfo.viewId === _viewId;
  return isMirrorView ? _mirror?.id : _viewId;
};

// Get current node view (contains mirror & datasheet).
export const getViewInNode = (state: IReduxState, datasheetId: string, viewId?: string) => {
  const _viewId = viewId || getActiveViewId(state, datasheetId);
  const nodeViewId = getViewIdByNodeId(state, datasheetId, _viewId);
  const snapshot = getSnapshot(state, datasheetId);
  if (!snapshot || !_viewId) {
    return;
  }
  const mirror = getMirror(state, nodeViewId);
  if (nodeViewId && mirror) {
    const temporaryView = getNodeViewWithoutFilterInfo(snapshot, _viewId, mirror);
    return {
      ...temporaryView,
      id: nodeViewId,
    } as IViewProperty;
  }
  return getViewById(snapshot, _viewId);
};

export const getViewById = (snapshot: ISnapshot, viewId: string) => {
  return snapshot?.meta.views.find((view) => view.id === viewId);
};

export const getCloseSyncViewIds = (state: IReduxState, dsId: string) => {
  const client = getDatasheetClient(state, dsId);
  return client?.closeSyncViewIds;
};

/**
 * Get the node view configuration, mirroring does not include filtering,
 * it will be done inside the filtering logic.
 * @param viewId
 * @param mirror
 */
export const getNodeViewWithoutFilterInfo = (snapshot: ISnapshot, viewId: string, mirror?: IMirror | null) => {
  const temporaryView = mirror?.temporaryView;
  if (!snapshot) {
    return;
  }
  const originView = getViewById(snapshot, viewId);
  if (!temporaryView || mirror?.sourceInfo.datasheetId !== snapshot.datasheetId) {
    return originView;
  }
  // If any view configuration is modified in the mirror,
  // the view configuration operation of the original table will not affect the mirror anymore,
  // so the cached data of the mirror is taken directly here.
  return {
    id: originView!.id,
    type: originView!.type,
    rows: originView!.rows,
    ...temporaryView,
    filterInfo: originView?.filterInfo,
  } as IViewProperty;
};
