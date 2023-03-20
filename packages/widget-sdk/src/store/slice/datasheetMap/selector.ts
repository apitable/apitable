import { Role } from 'core';
import { IWidgetState } from 'interface';
import { ConfigConstant, IFieldPermissionMap, Selectors } from 'core';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';

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
    (state: IWidgetState) => {
      const mirrorId = state.widget?.snapshot.sourceId;
      return mirrorId?.startsWith('mir') && state.mirrorMap?.[mirrorId]?.mirror;
    }
  ],
  (views, fieldPermissionMap, viewId, mirror) => {
    if (!views) {
      return;
    }
    const view = views.find(view => view.id == viewId) || views[0];

    if (!view) {
      return;
    }

    let columns = view.columns.filter(column => {
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
      return fieldRole !== ConfigConstant.Role.None;
    });

    if (typeof view.displayHiddenColumnWithinMirror === 'boolean' && !view.displayHiddenColumnWithinMirror && mirror) {
      const originViewHiddenColumnIds = columns.filter(item => item.hidden).map(item => item.fieldId) || [];
      const mirrorColumns = mirror.temporaryView?.columns;
      const mirrorFilterColumns = mirrorColumns?.filter(item => {
        return !originViewHiddenColumnIds.includes(item.fieldId);
      });

      if (!mirrorFilterColumns) {
        // If mirrorFilterColumns does not exist, it means that the user has not configured a trial view in the mirror.
        // In this case, only the hidden columns in the original view need to be filtered.
        columns = view.columns.filter(col => !col.hidden);
      }
    }

    return {
      ...view,
      columns
    };
  }
)((state, viewId?: string, datasheetId?: string) => viewId || getViews(state, datasheetId)?.[0]?.id);

export const getFieldMap = createSelector(
  [(state: IWidgetState, useDatasheetId: string | undefined) => getSnapshot(state, useDatasheetId)?.meta, getFieldPermissionMap],
  (meta, fieldPermissionMap) => {
    const _fieldMap = {};
    const fieldMap = meta?.fieldMap;
    if (!fieldMap) {
      return;
    }
    if (!fieldPermissionMap) {
      return fieldMap;
    }
    for (const fieldId in fieldMap) {
      const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);
      if (fieldRole === Role.None) {
        // room-server currently don't do data filter for no permission fields,
        // so do it in selector
        continue;
      }
      _fieldMap[fieldId] = fieldMap[fieldId];
    }
    return _fieldMap;
  }
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
export const getActiveViewId = (state: IWidgetState, id?: string) => {
  const datasheet = getWidgetDatasheet(state, id);
  const views = datasheet?.snapshot.meta.views;
  const pageViewId = state.pageParams?.viewId;
  if (!views) {
    return pageViewId;
  }
  if (!views.find(item => item.id === pageViewId)) {
    return views[0]?.id;
  }
  return pageViewId;
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

export const getPrimaryFieldId = (state: IWidgetState, datasheetId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  const view = snapshot?.meta.views[0];
  return view?.columns[0]?.fieldId;
};
