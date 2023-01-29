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

import { IDatasheetPack, IReduxState, Role } from 'core';
import { IWidgetDashboardState, IWidgetDatasheetState, IWidgetState } from 'interface';
import { ConfigConstant, IFieldMap, IFieldPermissionMap, Selectors } from 'core';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { widgetMessage } from 'iframe_message';
import { IDashboardPack } from '@apitable/core';
import { widgetStore } from '../root';
import { expireCalcCache, refreshCalcCache } from '../calc_cache/action';

/**
 * Get the datasheet state required by the widget in one go.
 */
export const widgetDatasheetSelector = (state: IReduxState, datasheetId: string): IWidgetDatasheetState | null => {
  const datasheetPack = state.datasheetMap[datasheetId];
  if (!datasheetPack) {
    return null;
  }
  const datasheet = datasheetPack.datasheet;
  if (!datasheet) {
    return null;
  }
  // Part of the data is approximately equal to no data, can not be calculated, logarithmic datasheet filter will report an error.
  if (datasheet.isPartOfData) {
    return null;
  }
  const { snapshot, permissions, name, activeView } = datasheet;
  const { collaborators, selection, activeRowInfo } = datasheetPack.client!;
  return {
    connected: true,
    datasheet: {
      id: datasheetId,
      datasheetName: name,
      datasheetId,
      permissions,
      snapshot,
      fieldPermissionMap: datasheetPack.fieldPermissionMap,
      activeView,
    },
    client: {
      collaborators,
      selection,
      activeRowInfo,
    },
  };
};

export const iframeWidgetDatasheetSelector = (datasheetPack: IDatasheetPack): IWidgetDatasheetState | null => {
  if (!datasheetPack) {
    return null;
  }
  const datasheet = datasheetPack.datasheet;
  if (!datasheet) {
    return null;
  }
  const datasheetId = datasheetPack.datasheet?.id;
  if (!datasheetId) {
    return null;
  }
  const { snapshot, permissions, name, activeView, isPartOfData } = datasheet;
  const { collaborators, selection } = datasheetPack.client!;
  return {
    connected: true,
    datasheet: {
      id: datasheetId,
      datasheetName: name,
      datasheetId,
      permissions,
      snapshot,
      fieldPermissionMap: datasheetPack.fieldPermissionMap,
      activeView,
      isPartOfData,
    },
    client: {
      collaborators,
      selection,
    },
  };
};

export const iframeWidgetDashboardSelector = (dashboardPack?: IDashboardPack | null): IWidgetDashboardState | null => {
  if (!dashboardPack || !dashboardPack.dashboard) {
    return null;
  }
  return {
    permissions: dashboardPack.dashboard.permissions,
    collaborators: dashboardPack.client.collaborators,
  };
};

export const isCurrentDatasheetActive = (state: IWidgetState, currentDatasheetId?: string) => {
  return currentDatasheetId === state.pageParams?.datasheetId;
};

export const getSnapshot = (state: IWidgetState, datasheetId?: string) => {
  const dstId = datasheetId || state.widget?.snapshot.datasheetId;
  const datasheet = getWidgetDatasheet(state, dstId);
  if (!datasheet) {
    return null;
  }
  return datasheet.snapshot;
};

export const getViews = (state: IWidgetState, datasheetId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  return snapshot?.meta.views;
};

export const getFieldPermissionMap = (state: IWidgetState, datasheetId?: string) => {
  const dstId = datasheetId || state.widget?.snapshot.datasheetId;
  const datasheet = getWidgetDatasheet(state, dstId);
  if (!datasheet) {
    return;
  }
  return datasheet.fieldPermissionMap;
};

export const getView = createCachedSelector(
  [
    (state: IWidgetState, _viewId: string, datasheetId: string) => getViews(state, datasheetId),
    getFieldPermissionMap,
    (_state: IWidgetState, viewId: string) => viewId,
  ],
  (views, fieldPermissionMap, viewId) => {
    if (!views) {
      return;
    }
    const view = views.find(view => view.id == viewId) || views[0]!;

    return {
      ...view,
      columns: view.columns.filter(column => {
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
        return fieldRole !== ConfigConstant.Role.None;
      }),
    };
  },
)((state, viewId?: string, datasheetId?: string) => viewId || getViews(state, datasheetId)?.[0]!.id);

export const getFieldMap = createSelector(
  [(state: IWidgetState, useDatasheetId: string | undefined) => getSnapshot(state, useDatasheetId)?.meta, getFieldPermissionMap],
  (meta, fieldPermissionMap) => {
    const _fieldMap: IFieldMap = {};
    const fieldMap = meta?.fieldMap;
    if (!fieldMap) {
      return;
    }
    for (const fieldId in fieldMap) {
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
      if (!fieldRole || fieldRole !== ConfigConstant.Role.None) {
        _fieldMap[fieldId] = fieldMap[fieldId]!;
      }
    }
    return _fieldMap;
  },
);

export const getWidgetDatasheet = (state: IWidgetState, id?: string) => {
  return getWidgetDatasheetPack(state, id)?.datasheet;
};

export const getFieldRoleByFieldId = (fieldPermissionMap: IFieldPermissionMap | undefined, fieldId: string): null | Role => {
  if (!fieldPermissionMap || !fieldPermissionMap[fieldId]) {
    return null;
  }
  const role = fieldPermissionMap[fieldId]!.role;
  return role || Role.None;
};

// Get the currently active view.
export const getActiveView = (state: IWidgetState, id?: string) => {
  const datasheet = getWidgetDatasheet(state, id);
  if (!datasheet) {
    return undefined;
  }
  const viewList = datasheet && datasheet.snapshot.meta.views;
  if (viewList.findIndex(item => item.id === datasheet.activeView) !== -1) {
    return datasheet.activeView;
  }
  return viewList[0]!.id;
};

export const getWidgetDatasheetPack = (state: IWidgetState, id?: string) => {
  const datasheetId = id || state.widget?.snapshot.datasheetId;
  if (!datasheetId) {
    return null;
  }
  return state.datasheetMap?.[datasheetId];
};

export const getSelection = (state: IWidgetState) => {
  return getWidgetDatasheetPack(state)?.client.selection;
};

export const getPermissions = (state: IWidgetState, id?: string) => {
  return getWidgetDatasheet(state, id)?.permissions;
};

export const getVisibleRowsCalcCache = (state: IWidgetState, datasheetId: string, viewId: string) => {
  const { cache, expire } = state.calcCache?.[datasheetId]?.[viewId] || {};
  if (!cache && getViewById(state, datasheetId, viewId)) {
    // Prevent repeated initialization.
    widgetStore.dispatch(
      refreshCalcCache({
        datasheetId,
        viewId,
        cache: [],
      }),
    );
    widgetMessage.initCache(datasheetId, viewId);
    return null;
  }
  if (expire) {
    // Avoid repeatedly sending messages that update the cache due to caching de-caching.
    widgetStore.dispatch(expireCalcCache({ datasheetId, viewId, expire: false }));
    widgetMessage.initCache(datasheetId, viewId);
  }
  return cache;
};

export const getViewById = (state: IWidgetState, datasheetId: string, viewId: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  if (!snapshot) {
    return null;
  }
  if (state?.pageParams?.mirrorId && state?.pageParams?.datasheetId === snapshot.datasheetId) {
    const mirror = Selectors.getMirror(state as any);
    return Selectors.getTemporaryView(snapshot!, viewId, datasheetId, mirror);
  }
  return Selectors.getTemporaryView(snapshot, viewId, datasheetId);
};

export const getVisibleColumns = (state: IWidgetState, datasheetId: string, viewId: string) => {
  const columns = getViewById(state, datasheetId, viewId)?.columns;
  if (!columns) {
    return [];
  }
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  return columns.filter(({ fieldId, hidden }) => {
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
    return !hidden && fieldRole !== ConfigConstant.Role.None;
  });
};
