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

import { getReaderRolePermission } from 'engine/get_reader_role_permission';

import { Strings, t } from 'exports/i18n';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';

import { IRange, Range } from 'model/view/range';
import createCachedSelector from 're-reselect';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import {
  AlarmUsersType,
  ICalendarViewColumn,
  ICalendarViewProperty,
  IDatasheetState,
  IFieldMap,
  IFieldPermissionMap,
  IGalleryViewProperty,
  IGanttViewColumn,
  IGanttViewProperty,
  IGridViewColumn,
  IGridViewProperty,
  IMirror,
  IOrgChartViewColumn,
  IOrgChartViewProperty,
  IPermissions,
  IRecordAlarm,
  IRecordAlarmClient,
  IRecordSnapshot,
  IReduxState,
  ISnapshot,
  IViewColumn,
  IViewProperty,
  Role,
} from 'exports/store/interfaces';
import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_PERMISSION,
  PREVIEW_DATASHEET_ID,
  RowHeight,
  RowHeightLevel,
  ScreenWidth,
  ViewType,
} from 'modules/shared/store/constants';

import { getMirror, getMirrorNetworking } from 'modules/database/store/selectors/resource/mirror';

import { FieldType, IField, IFilterInfo, IGroupInfo, IMemberField } from 'types';

import {
  getActiveDatasheetId,
  getActiveViewId,
  getDatasheet,
  getDatasheetClient,
  getDatasheetConnected,
  getField,
  getFieldPermissionMap,
  getFieldRoleByFieldId,
  getRecord,
  getSearchKeyword,
  getSearchResultCursorIndex,
  getSnapshot,
  getViewById,
} from './base';

import { getSearchResult, getVisibleRows } from './rows_calc';

export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const defaultKeySelector = (state: IReduxState, datasheetId: string | undefined | void) => datasheetId || getActiveDatasheetId(state);

export const getDatasheetIds = createDeepEqualSelector(
  (state: IReduxState) => Object.keys(state.datasheetMap),
  (keys) => keys
);

/**
 * get current search result's one record(cell)
 * @param state
 * @returns
 */
export const getCurrentSearchItem = (state: IReduxState) => {
  const searchKeyword = getSearchKeyword(state);
  const searchResultCursorIndex = getSearchResultCursorIndex(state);
  if (!searchKeyword) {
    return;
  }
  const searchResultArray = getSearchResult(state);
  if (!searchResultArray || !Array.isArray(searchResultArray)) {
    return;
  }
  const currentItem = searchResultArray[searchResultCursorIndex || 0];
  return currentItem;
};

export const getCurrentSearchRecordId = (state: IReduxState) => {
  const searchKeyword = getSearchKeyword(state);
  if (!searchKeyword) {
    return;
  }
  const searchResultCursorIndex = getSearchResultCursorIndex(state);
  const visibleRows = getVisibleRows(state);
  // Compatible with the case where the search result visibleRows may be empty.
  if (searchResultCursorIndex != null && visibleRows.length) {
    return visibleRows[searchResultCursorIndex]?.recordId;
  }
  return;
};

// (no cache)calc and get current visible columns
export const getVisibleColumnsBase = (view?: IViewProperty) => {
  return view ? view.columns.filter((item, i) => !(item.hidden && i !== 0)) : [];
};

// calc and get a width of a column
export const getColumnWidth = (column: IGridViewColumn) => (!column || column.width == null ? DEFAULT_COLUMN_WIDTH : column.width);

export const getView = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.find((view) => view.id === viewId);
};

export const getViewIndex = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.findIndex((view) => view.id === viewId);
};

const filterColumnsByPermission = (columns: IViewColumn[], fieldPermissionMap: IFieldPermissionMap | undefined) => {
  return columns.filter((column) => {
    // TODO: column permission delete this logic (2nd phase)
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
    return fieldRole !== Role.None;
  });
};

export const getCurrentViewBase = (
  snapshot: ISnapshot | undefined,
  viewId: string | undefined,
  datasheetId?: string,
  fieldPermissionMap?: IFieldPermissionMap | undefined,
  mirror?: IMirror | null
) => {
  if (!viewId) {
    return;
  }

  const view = getTemporaryView(snapshot, viewId, datasheetId, mirror);

  if (!view) {
    return;
  }

  const permissionColumns = filterColumnsByPermission(view.columns, fieldPermissionMap);
  if (permissionColumns.length !== view.columns.length) {
    // we need to update the frozenColumnCount in mirror view when the permissionColumns is changed
    if (mirror?.id && (view.type === ViewType.Grid || view.type === ViewType.Gantt)) {
      let frozenColumnCount = view.frozenColumnCount;
      view.columns.slice(0, view.frozenColumnCount).forEach((column) => {
        const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
        if (fieldRole === Role.None) {
          frozenColumnCount--;
        }
      });
      return {
        ...view,
        frozenColumnCount,
        columns: permissionColumns,
      };
    }
    return {
      ...view,
      columns: permissionColumns,
    };
  }
  return view;
};
export const getCurrentView = createCachedSelector<
  IReduxState,
  string | undefined | void,
  ISnapshot | undefined,
  string | undefined,
  string | undefined,
  IFieldPermissionMap | undefined,
  IMirror | undefined | null,
  IViewProperty | undefined
>(
  [
    getSnapshot,
    getActiveViewId,
    (state, datasheetId) => datasheetId || getActiveDatasheetId(state),
    getFieldPermissionMap,
    (state: IReduxState) => getMirror(state),
  ],
  getCurrentViewBase
)({
  // keySelector: (state, datasheetId) => state.pageParams.mirrorId || datasheetId || getActiveDatasheetId(state),
  keySelector: defaultKeySelector,
});

export const getViewByIdWithDefault = (state: IReduxState, datasheetId: string, viewId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  if (!snapshot) {
    return null;
  }
  const firstViewId = snapshot.meta.views[0]!.id;

  let defaultView = getCurrentViewBase(snapshot, firstViewId, datasheetId, fieldPermissionMap, getMirror(state));
  if (viewId) {
    defaultView = getCurrentViewBase(snapshot, viewId, datasheetId, fieldPermissionMap, getMirror(state)) || defaultView;
  }

  return defaultView;
};

export const getTemporaryView = (snapshot: ISnapshot | undefined, viewId: string, _datasheetId?: string, mirror?: IMirror | null) => {
  const temporaryView = mirror?.temporaryView;

  if (!snapshot) {
    return;
  }

  const originView = getViewById(snapshot, viewId);
  if (!temporaryView || mirror?.sourceInfo.datasheetId !== snapshot.datasheetId) {
    return originView;
  }
  // in mirror, if any view config is modified,
  // the original table's view config will not affect the mirror, so here directly use the mirror's cache data
  return {
    id: originView!.id,
    type: originView!.type,
    rows: originView!.rows,
    ...temporaryView,
  } as IViewProperty;
};

export const getFilterInfoExceptInvalid = (state: IReduxState, datasheetId?: string, filterInfo?: IFilterInfo) => {
  // filterInfo.conditions is empty will cause no filter but no data returned, so we need to filter it
  if (!filterInfo || !filterInfo.conditions.length) {
    return undefined;
  }

  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  const snapshot = getSnapshot(state, datasheetId);

  if (!fieldPermissionMap || !snapshot) {
    return filterInfo;
  }

  return {
    ...filterInfo,
    conditions: filterInfo.conditions.filter((condition) => {
      const fieldMap = snapshot.meta.fieldMap;
      const field = fieldMap[condition.fieldId]!;

      if (!field) {
        return false;
      }
      return true;
    }),
  };
};

export const getKanbanFieldId = (state: IReduxState) => {
  const view = getCurrentView(state);
  const fieldMap = getFieldMap(state);
  if (!view || view.type !== ViewType.Kanban || !fieldMap) {
    return;
  }
  const fieldId = view.style.kanbanFieldId;
  if (fieldId && !fieldMap[fieldId]) {
    return;
  }
  return fieldId;
};

export const getGroupInfoWithPermission = (state: IReduxState, groupInfo: IGroupInfo, datasheetId?: string) => {
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  if (!groupInfo || !fieldPermissionMap) {
    return groupInfo;
  }
  return groupInfo.filter((group) => {
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, group.fieldId);

    if (fieldRole === Role.None) {
      return false;
    }

    return true;
  });
};

// TODO: field permissions 2nd version, no need to handle special case if there is data filter
export const getFieldMapBase = (datasheet: IDatasheetState | null | undefined, fieldPermissionMap?: IFieldPermissionMap | undefined) => {
  const fieldMap = datasheet && datasheet.snapshot.meta.fieldMap;

  if (!fieldPermissionMap) {
    return fieldMap;
  }

  if (!fieldMap) {
    return null;
  }

  const _fieldMap = {};
  for (const k in fieldMap) {
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, k);
    if (fieldRole === Role.None) {
      // room-server currently don't do data filter for no permission fields,
      // so do it in selector
      continue;
    }
    _fieldMap[k] = fieldMap[k];
  }
  return _fieldMap;
};

export const getFieldMap = createCachedSelector<
  IReduxState,
  string | undefined | void,
  undefined | IDatasheetState | null,
  IFieldPermissionMap | undefined,
  IFieldMap | null | undefined
>(
  [getDatasheet, getFieldPermissionMap],
  getFieldMapBase
)(defaultKeySelector);

export const getFieldMapIgnorePermission = createCachedSelector<
  IReduxState,
  string | undefined | void,
  IDatasheetState | undefined | null,
  IFieldMap | null | undefined
>(
  [getDatasheet],
  getFieldMapBase
)(defaultKeySelector);

export const getColumnIndexMap = createSelector<IReduxState, string | undefined, IViewProperty | undefined, { [id: string]: number }>(
  [getCurrentView],
  (view) => {
    const columnsMap: { [id: string]: number } = {};
    if (!view) {
      return columnsMap;
    }
    for (const [k, v] of view.columns.entries()) {
      columnsMap[v.fieldId] = k;
    }
    return columnsMap;
  }
);

export const getVisibleColumns = createCachedSelector<
  IReduxState,
  string | undefined | void,
  IViewProperty | undefined,
  IFieldPermissionMap | undefined,
  IViewColumn[]
>([getCurrentView, getFieldPermissionMap], (view?: IViewProperty, fieldPermissionMap?) => {
  // ignore the first column as hidden
  return view
    ? view.columns.filter((item, i) => {
        const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
        if (fieldRole === Role.None) {
          return false;
        }
        return !(item.hidden && i !== 0);
      })
    : [];
})(defaultKeySelector);

export const getVisibleColumnsMap = createSelector([getVisibleColumns], (columns) => {
  return new Map(columns?.map((item, index) => [item.fieldId, index]));
});

export const findColumnIndexById = (state: IReduxState, id: string): number => {
  const columnsMap = getVisibleColumnsMap(state);
  const index = columnsMap.get(id);
  if (!isNumber(index)) {
    throw new Error(
      t(Strings.error_not_exist_id, {
        id,
      })
    );
  }
  return index;
};

// reselect for non-frozen columns
export const getExceptFrozenColumns = createSelector([getVisibleColumns, getCurrentView], (columns: IGridViewColumn[], view?: IViewProperty) => {
  return !view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt) ? [] : columns.slice(view.frozenColumnCount);
});

// reselect for frozen columns
export const getFrozenColumns = createSelector([getVisibleColumns, getCurrentView], (columns: IGridViewColumn[], view?: IViewProperty) => {
  return !view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt) ? [] : columns.slice(0, view.frozenColumnCount);
});

// get current active view's filter info
export const getActiveViewFilterInfo = createSelector([getCurrentView], (view: IViewProperty | undefined) => {
  if (!view?.filterInfo) {
    return null;
  }
  return view.filterInfo;
});

// get current active view's sort info
export const getActiveViewSortInfo = createSelector([getCurrentView], (view: IViewProperty | undefined) => {
  return view?.sortInfo;
});

// get current active view's group info
export const getActiveViewGroupInfo = createSelector([getCurrentView], (view: IViewProperty | undefined) => {
  if (!view?.groupInfo) {
    return [];
  }
  return view.groupInfo;
});

export const getRangeFields = (state: IReduxState, range: IRange, datasheetId: string): IField[] | null => {
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const columnSlice = [rangeIndex.field.min, rangeIndex.field.max + 1];
  const columns = getVisibleColumns(state);
  return columns.slice(...columnSlice).map((col) => getField(state, col.fieldId, datasheetId));
};

export const getRecordSnapshot = (state: IReduxState, datasheetId: string, recordId: string): IRecordSnapshot | null => {
  const snapshot = getSnapshot(state, datasheetId);
  const fieldMap = getFieldMap(state, datasheetId);
  if (!snapshot || !fieldMap) {
    return null;
  }
  const record = getRecord(state, recordId, datasheetId);
  if (!record) {
    return null;
  }
  return {
    meta: { fieldMap },
    recordMap: {
      [recordId]: record,
    },
    datasheetId,
  };
};

export const getVisibleColumnCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view) {
    return -1;
  }
  return getVisibleColumns(state).length;
};

/**
 * get the number of filters that "have been applied"
 */
export const getEffectConditionCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view) {
    return 0;
  }
  const filterInfo = view.filterInfo;
  if (!filterInfo) {
    return 0;
  }

  // TODO improve the logic
  return filterInfo.conditions.length; // filter(isConditionTakeEffect).length;
};

export const getColumnByFieldId = (state: IReduxState, fieldId: string) => {
  const columns = getVisibleColumns(state);
  return columns.find((column) => column.fieldId === fieldId);
};

export const getRowHeightFromLevel = (level?: RowHeightLevel): number => {
  return level == null ? RowHeight.Short : RowHeight[RowHeightLevel[level]!];
};

export const getGroupLevel = createSelector([getActiveViewGroupInfo], (groupInfo) => {
  return groupInfo.length;
});

export const getCurrentGalleryViewStyle = createSelector([getCurrentView], (view: IViewProperty | undefined) => {
  if (view!.type !== ViewType.Gallery) {
    return;
  }
  return (view as IGalleryViewProperty).style;
});

const getIntegratePermissionWithFieldBase = (
  _state: IReduxState,
  { permission, fieldId, fieldPermissionMap }: { permission: IPermissions; fieldId?: string; fieldPermissionMap?: IFieldPermissionMap }
) => {
  const fieldPermission = fieldPermissionMap && fieldId ? fieldPermissionMap[fieldId] : undefined;

  if (!fieldPermission) {
    return permission;
  }
  return {
    ...permission,
    fieldRemovable: fieldPermission.manageable,
    cellEditable: fieldPermission.role === Role.Editor,
    fieldPropertyEditable: fieldPermission.manageable,
  };
};

const getIntegratePermissionWithField = createCachedSelector<
  IReduxState,
  {
    permission: IPermissions;
    datasheetId?: string;
    mirrorId?: string;
    fieldId?: string;
    fieldPermissionMap?: IFieldPermissionMap;
  },
  IPermissions,
  IPermissions
>(getIntegratePermissionWithFieldBase, (permission) => {
  return permission;
})({
  keySelector: (state, { datasheetId, mirrorId }) => mirrorId || datasheetId || getActiveDatasheetId(state),
  selectorCreator: createDeepEqualSelector,
});

export const getPermissions = (state: IReduxState, datasheetId?: string, fieldId?: string, sourceMirrorId?: string): IPermissions => {
  const datasheet = getDatasheet(state, datasheetId);
  const mirrorId = sourceMirrorId || state.pageParams.mirrorId;
  const nodeConnected = mirrorId ? getMirrorNetworking(state, mirrorId)?.connected : getDatasheetConnected(state, datasheetId);
  const screenWidth = state?.space?.screenWidth;
  const paramsNodeId = mirrorId || getActiveDatasheetId(state);
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);

  // only in the mirror, the permission should be integrated with field permission
  // which means the url of datasheetId should be the same as "the datasheetId to query"
  const nodePermission =
    mirrorId && (datasheet?.id === getActiveDatasheetId(state) || sourceMirrorId) ? getMirror(state, mirrorId)?.permissions : datasheet?.permissions;
  const blackSpace = state.billing?.subscription?.blackSpace;

  if (blackSpace) {
    // blacklist space will reset all node's permission to readonly
    return DEFAULT_PERMISSION;
  }

  if (screenWidth && screenWidth < ScreenWidth.md) {
    // smallScreen temporary not allow edit
    // TODO: mobile will support edit in the future
    const permission = datasheet
      ? getIntegratePermissionWithField(state, {
          permission: getReaderRolePermission(state, datasheet.id, nodePermission)!,
          datasheetId,
          fieldPermissionMap,
          fieldId: fieldId,
          mirrorId,
        })
      : {};
    return {
      ...DEFAULT_PERMISSION,
      ...permission,
      rowSortable: false,
    };
  }

  // forbid all permission when previewing time machine
  if (!datasheet || state.datasheetMap[PREVIEW_DATASHEET_ID]) {
    return DEFAULT_PERMISSION;
  }

  // share / templates page, return permission directly
  if (state.pageParams.shareId || state.pageParams.templateId || state.pageParams.embedId) {
    return getIntegratePermissionWithField(state, {
      permission: getReaderRolePermission(state, datasheet.id, nodePermission)!,
      datasheetId,
      fieldPermissionMap,
      fieldId: fieldId,
      mirrorId,
    });
  }

  /**
   * when connection is not ready, return default forbidden edit permission
   * but, here attention, according to v0.6.2 infra refactor,
   * the whole `tab` only exist one room.
   * in the other world, only 1 datasheet under connect state.
   * for relation datasheets, connect is false,
   * so, the check of connect, only in the main datasheet of creating room.
   * no need to care about the relation datasheets.
   *
   */
  if (!nodeConnected && paramsNodeId === datasheet.id) {
    return DEFAULT_PERMISSION;
  }

  return getIntegratePermissionWithField(state, {
    permission: getReaderRolePermission(state, datasheet.id, nodePermission)!,
    datasheetId,
    fieldPermissionMap,
    fieldId: fieldId,
    mirrorId,
  });
};

export const getViewRowHeight = (state: IReduxState) => {
  const view = getCurrentView(state)!;
  if ([ViewType.Grid, ViewType.Gantt].includes(view?.type)) {
    // new table has no rowHeight property, only add view will init new view.
    return (view as IGridViewProperty).rowHeightLevel || RowHeightLevel.Short;
  }
  return;
};

// get view's actual row count, not affected by filter
export const getActualRowCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  return view?.rows.length;
};

export const getFilterConditionValue = (state: IReduxState, conditionId: string) => {
  const filterInfo = getCurrentView(state)!.filterInfo;

  if (filterInfo) {
    const result = filterInfo.conditions.find((item) => {
      return item.conditionId === conditionId;
    });
    return result && result.value ? result.value : null;
  }
  return null;
};

export const getKanbanGroupMapIds = createSelector(
  [getFieldMap, getKanbanFieldId, getFieldPermissionMap],
  (fieldMap, kanbanFieldId, fieldPermissionMap) => {
    if (!kanbanFieldId) {
      return [];
    }
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
    if (fieldRole === Role.None) {
      return [];
    }
    const field = fieldMap![kanbanFieldId]!;
    if (!field) {
      return [];
    }
    if (field.type === FieldType.SingleSelect) {
      return field.property.options.map((item) => item.id);
    }
    return (field as IMemberField).property.unitIds;
  }
);

export const getQueryMeta = createSelector(
  [getVisibleColumns, getActiveDatasheetId, getActiveViewFilterInfo, getActiveViewGroupInfo, getActiveViewSortInfo],
  (selectFields, fromDstId, filterInfo, groupInfo, sortInfo) => {
    let q = `select ${selectFields.map((field) => field.fieldId).join(',')} from ${fromDstId}\n`;
    if (filterInfo) {
      q += `where ${filterInfo.conditions.map((cond) => `${cond.fieldId} ${cond.operator} ${cond.value}`).join(` ${filterInfo.conjunction} `)}\n`;
    }
    if (groupInfo && groupInfo.length) {
      q += `group by ${groupInfo.map((gInfo) => gInfo.fieldId).join(',')}\n`;
    }
    if (sortInfo) {
      q += `order by ${sortInfo.rules.map((rule) => `${rule.fieldId} ${rule.desc ? 'desc' : ''}`).join(',')}\n`;
    }
    return q;
  }
);

export const getCalendarStyle = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view || view.type !== ViewType.Calendar) {
    return;
  }
  return view.style;
};
export const getCalendarViewStatus = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  if (!client) {
    return client;
  }
  return client.calendarViewStatus;
};

export const getOrgChartViewStatus = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  if (!client) {
    return client;
  }
  return client.orgChartViewStatus;
};

export const getKanbanViewStatus = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  if (!client) {
    return client;
  }
  return client.kanbanViewStatus;
};

export const getCalendarVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | undefined, ICalendarViewColumn[]>(
  [getCurrentView],
  (view?: IViewProperty) => {
    return view ? (view as ICalendarViewProperty).columns.filter((item, i) => !(item.hiddenInCalendar && i !== 0)) : [];
  }
)(defaultKeySelector);

export const getOrgChartVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | undefined, IOrgChartViewColumn[]>(
  [getCurrentView],
  (view?: IViewProperty) => {
    return view ? (view as IOrgChartViewProperty).columns.filter((item: IOrgChartViewColumn, i) => !(item.hiddenInOrgChart && i !== 0)) : [];
  }
)(defaultKeySelector);

export const getCalendarVisibleColumnCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view || view.type !== ViewType.Calendar) {
    return -1;
  }
  return getCalendarVisibleColumns(state).length;
};

export const getGanttStyle = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view || view.type !== ViewType.Gantt) {
    return;
  }
  return view.style;
};

export const getGanttVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | undefined, IGanttViewColumn[]>(
  [getCurrentView],
  (view?: IViewProperty) => {
    return view ? (view as IGanttViewProperty).columns.filter((item) => !item.hiddenInGantt) : [];
  }
)(defaultKeySelector);

export const getGanttVisibleColumnCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view || view.type !== ViewType.Gantt) {
    return -1;
  }
  return getGanttVisibleColumns(state).length;
};

export const integrateRecordEditable = (state: IReduxState, fieldId: string, datasheetId?: string) => {
  const permission = getPermissions(state, datasheetId);
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);

  if (fieldRole) {
    return fieldRole === Role.Editor;
  }

  return permission.editable;
};

export const getDateTimeCellAlarm = (snapshot: IRecordSnapshot, recordId: string, fieldId: string): IRecordAlarm | undefined => {
  // notification center open card without snapshot
  const recordMeta = snapshot?.recordMap?.[recordId]?.recordMeta;
  if (!recordMeta) {
    return;
  }
  const fieldExtraMap = recordMeta?.fieldExtraMap;
  if (!fieldExtraMap) {
    return;
  }
  return fieldExtraMap[fieldId]?.alarm;
};

/**
 *
 * a method for front-end use
 * attention: this method return a new data structure, can not be used in useSelector
 *
 */
export const getDateTimeCellAlarmForClient = (snapshot: IRecordSnapshot, recordId: string, fieldId: string): IRecordAlarmClient | undefined => {
  const alarm = getDateTimeCellAlarm(snapshot, recordId, fieldId);

  if (!alarm) {
    return;
  }

  if (!Array.isArray(alarm.alarmUsers)) {
    return;
  }

  if (alarm.alarmUsers[0]!.type === AlarmUsersType.Field) {
    const fieldMap = snapshot.meta.fieldMap;
    return {
      ...alarm,
      target: AlarmUsersType.Field,
      alarmUsers: alarm.alarmUsers.map((item) => item.data).filter((fieldId) => fieldMap[fieldId] && fieldMap[fieldId]!.type === FieldType.Member),
    };
  }
  return {
    ...alarm,
    target: AlarmUsersType.Member,
    alarmUsers: alarm.alarmUsers.map((item) => item.data),
  };
};
