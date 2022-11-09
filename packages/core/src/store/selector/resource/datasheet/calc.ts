import { CacheManager, NO_CACHE, visibleRowsBaseCacheManage } from 'cache_manager';
import { computeCache, dataSelfHelper } from 'compute_manager';
import { ViewPropertyFilter } from 'engine';

import { evaluate } from 'formula_parser';
import { Strings, t } from 'i18n';
import { produce } from 'immer';
import { set } from 'lodash';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import sortBy from 'lodash/sortBy';

import {
  DatasheetActions, Field, Group, handleEmptyCellValue, IAutomaticallyField, ICell, ICellValue, IRange, LookUpField, MemberField, Range,
} from 'model';
import createCachedSelector from 're-reselect';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';

import {
  CellType, DEFAULT_COLUMN_WIDTH, DEFAULT_PERMISSION, PREVIEW_DATASHEET_ID, RecordMoveType, RowHeight, RowHeightLevel, ScreenWidth, SearchResultType,
  UN_GROUP, ViewType, WhyRecordMoveType,
} from 'store/constants';

import {
  AlarmUsersType, IActiveUpdateRowInfo, ICalendarViewColumn, ICalendarViewProperty, IDatasheetState, IFieldMap, IFieldPermissionMap, IGanttViewColumn,
  IGanttViewProperty, IGridViewColumn, IGridViewProperty, ILinearRow, IMirror, IOrgChartViewColumn, IOrgChartViewProperty, IPermissions, IRecord,
  IRecordAlarm, IRecordAlarmClient, IRecordMap, IRecordSnapshot, IReduxState, ISearchCellResult, ISearchRecordResult, ISearchResult, ISnapshot,
  IStandardValueTable, IViewColumn, IViewProperty, IViewRow, Role,
} from 'store/interface';
import { getGroupBreakpoint } from 'store/selector';
import { getMirror, getMirrorNetworking } from 'store/selector/resource/mirror';

import {
  BasicValueType, FieldType, FilterConjunction, FOperator, IAttachmentValue, IField, IFilterCondition, IFilterInfo, IFormulaField, IGroupInfo,
  ILinkIds, ILookUpField, IMemberField, ISortedField, IStandardValue, IUnitIds, RollUpFuncType,
} from 'types';

import {
  getActiveDatasheetId, getActiveRecordId, getActiveRowInfo, getDatasheet, getDatasheetClient, getDatasheetConnected, getField, getFieldPermissionMap,
  getFieldRoleByFieldId, getGroupingCollapseIds, getIsSearching, getRecord, getSearchKeyword, getSearchResultCursorIndex, getSnapshot,
} from './base';

import { getLinearRowsFormComputed, getPureVisibleRowsFormComputed, getSearchResultArray } from './computed';

/**
 * 
 * Field class needs to depend on the root state to calculate, 
 * we need to pass the root state to the selector, 
 * but we don't want to break the selector cache.
 * 
 * consider most cases, memorize the root state as a parameter is meaningless,
 * so we make an assumption here,
 * if the user passes the root state as a parameter,
 * then the memoize function never checks its change.
 */
const createSelectorIgnoreState = createSelectorCreator(defaultMemoize, (pre, next) => {
  // if compare to root state, always return true
  if (isObject(pre) && isObject(next) && ('isStateRoot' in pre) && ('isStateRoot' in next)) {
    return true;
  }
  // common reference comparison
  return pre === next;
});

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

const defaultKeySelector = (state: IReduxState, datasheetId: string) => datasheetId || getActiveDatasheetId(state);

const workerCompute = () => (global as any).useWorkerCompute;

export const getDatasheetIds = createDeepEqualSelector(
  (state: IReduxState) => Object.keys(state.datasheetMap),
  keys => keys,
);

/**
 * get current active view
 * 
 * @param state 
 * @param id 
 * @returns 
 */
export const getActiveView = (state: IReduxState, id?: string) => {
  const datasheet = getDatasheet(state, id);
  if (!datasheet) {
    return undefined;
  }
  const viewList = datasheet && datasheet.snapshot.meta.views;
  if (viewList.findIndex(item => item.id === datasheet.activeView) !== -1) {
    return datasheet.activeView;
  }
  return viewList[0].id;
};

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
  const searchResultArray = getSearchResultArray(state, searchKeyword);
  if (!searchResultArray || !Array.isArray(searchResultArray)) {
    return;
  }
  const currentItem = searchResultArray[searchResultCursorIndex || 0];
  return currentItem;
};

// (no cache)calc and get current visible columns
export const getVisibleColumnsBase = (view?: IViewProperty) => {
  return view ? view.columns.filter((item, i) => !(item.hidden && i !== 0)) : [];
};

// calc and get a width of a column
export const getColumnWidth = (column: IGridViewColumn) => (!column || column.width == null) ?
  DEFAULT_COLUMN_WIDTH : column.width;

export const getViewById = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.find(view => view.id === viewId);
};

export const getViewIndex = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.findIndex(view => view.id === viewId);
};

const filterColumnsByPermission = (columns: IViewColumn[], fieldPermissionMap: IFieldPermissionMap | undefined) => {
  return columns.filter((column) => {
    // TODO: column permission delete this logic (2nd phase)
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
    return fieldRole !== Role.None;
  });
};

export const getCurrentViewBase = (
  snapshot: ISnapshot,
  viewId: string | undefined,
  datasheetId?: string,
  fieldPermissionMap?: IFieldPermissionMap | undefined,
  mirror?: IMirror | null,
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
    return {
      ...view,
      columns: permissionColumns
    };
  }
  return view;
};
export const getCurrentView = createCachedSelector<IReduxState,
  string | void,
  ISnapshot | null | undefined,
  string | undefined,
  string | undefined,
  IFieldPermissionMap | undefined | void,
  IMirror | undefined | null,
  IViewProperty | undefined>(
    [
      getSnapshot,
      getActiveView,
      (state, datasheetId) => datasheetId || getActiveDatasheetId(state),
      getFieldPermissionMap,
      (state) => getMirror(state)
    ],
    getCurrentViewBase,
  )({
  // keySelector: (state, datasheetId) => state.pageParams.mirrorId || datasheetId || getActiveDatasheetId(state),
    keySelector: defaultKeySelector
  });

export const getViewByIdWithDefault = (state: IReduxState, datasheetId: string, viewId?: string) => {
  const snapshot = getSnapshot(state, datasheetId);
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  if (!snapshot) {
    return null;
  }
  const firstViewId = snapshot.meta.views[0].id;

  let defaultView = getCurrentViewBase(snapshot, firstViewId, datasheetId, fieldPermissionMap, getMirror(state));
  if (viewId) {
    defaultView = getCurrentViewBase(snapshot, viewId, datasheetId, fieldPermissionMap, getMirror(state)) || defaultView;
  }

  return defaultView;
};

// information of calculated cell
export const calcCellValue = (
  state: IReduxState,
  snapshot: IRecordSnapshot,
  fieldId: string,
  recordId: string,
  withError?: boolean,
  datasheetId?: string,
  // TODO: for first version of column permission, delete this field in next version
  ignoreFieldPermission?: boolean,
) => {
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  // TODO: temp code for the first version of column permission, delete this logic in next version
  const fieldPermissionMap = getFieldPermissionMap(state, snapshot.datasheetId);
  const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);

  if (!ignoreFieldPermission && fieldRole === Role.None) {
    return null;
  }

  if (!field) {
    return null;
  }

  const instance = Field.bindContext(field, state);

  if (instance.isComputed) {

    try {
      let cv = getComputeCellValue(state, snapshot, recordId, fieldId, withError);
      cv = handleEmptyCellValue(cv, instance.basicValueType);
      return cv;
    } catch (error) {
      console.warn('! ' + error);
    }
  }
  return getEntityCellValue(state, snapshot, recordId, fieldId, datasheetId);
};

/**
 * get cell value
 * 
 * @param state 
 * @param snapshot 
 * @param recordId 
 * @param fieldId 
 * @param withError 
 * @param datasheetId 
 * @param ignoreFieldPermission 
 * @returns 
 */
export const getCellValue = (
  state: IReduxState,
  snapshot: IRecordSnapshot,
  recordId: string,
  fieldId: string,
  withError?: boolean,
  datasheetId?: string,
  ignoreFieldPermission?: boolean,
) => {
  // TODO: temp code for the first version of column permission, delete this logic in next version
  const fieldPermissionMap = getFieldPermissionMap(state, snapshot.datasheetId);
  const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);

  if (!ignoreFieldPermission && fieldRole === Role.None) {
    return null;
  }

  const dsId = datasheetId || snapshot.datasheetId || state.pageParams.datasheetId;
  const calc = () => {
    return calcCellValueAndString({
      state,
      snapshot,
      fieldId,
      recordId,
      datasheetId: dsId,
      withError,
      ignoreFieldPermission,
    });
  };
  if (!dsId) {
    return calc().cellValue;
  }

  const cacheValue = CacheManager.getCellCache(dsId, fieldId, recordId);
  if (cacheValue !== NO_CACHE) {
    return cacheValue.cellValue;
  }
  const res = calc();
  if (!res.ignoreCache) {
    CacheManager.setCellCache(dsId, fieldId, recordId, res);
  }
  return res.cellValue;
};

export const getTemporaryView = (snapshot: ISnapshot, viewId: string, _datasheetId?: string, mirror?: IMirror | null) => {
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
    ...temporaryView
  } as IViewProperty;
};

export const getFilterInfoBase = createCachedSelector<IReduxState,
  string | undefined, ISnapshot | undefined, IViewProperty | undefined, IFilterInfo | undefined>([getSnapshot,
    getCurrentView],
  (snapshot, view,) => {
    if (!view || !snapshot) {
      return;
    }

    return view.filterInfo;
  })(defaultKeySelector);

export const getFilterInfo = createCachedSelector<IReduxState,
  string | undefined | void, ISnapshot | undefined, string | undefined, IMirror | undefined | null, IFilterInfo | undefined>(
    [getSnapshot, getActiveView, state => getMirror(state)], (snapshot, viewId, mirror) => {
      if (!snapshot || !viewId) {
        return;
      }
      const view = getViewById(snapshot, viewId);
      if (!view) {
        return;
      }
      if (mirror?.id) {
        const originViewConditionIds = view.filterInfo?.conditions.map(item => item.conditionId) || [];
        const filterInfo = mirror.temporaryView?.filterInfo;
        const mirrorConditions = filterInfo?.conditions.filter(item => {
          return !originViewConditionIds.includes(item.conditionId);
        });

        if (!mirrorConditions) {
          return mirror.temporaryView?.filterInfo;
        }
        return {
          conjunction: filterInfo!.conjunction,
          conditions: mirrorConditions
        };
      }
      return view.filterInfo;
    }
  )({
    keySelector: (state, datasheetId) => state.pageParams.mirrorId || datasheetId || getActiveDatasheetId(state),
  });

const doFilterOperations = (state: IReduxState, condition: IFilterCondition, snapshot: ISnapshot, record: IRecord, repeatRows?: string[]) => {
  /**
   * `or` condition has `repeatRows` only
   * `or` condition exists in repeatRows
   */
  if (repeatRows?.includes(record.id)) {
    return true;
  }
  const { fieldId } = condition;
  const field = snapshot.meta.fieldMap[fieldId];

  // currently, we don't filter data by the columns without permission, 
  // so we need to ignore the permission check when get `cellValue`
  const cellValue = getCellValue(state, snapshot, record.id, fieldId, undefined, undefined, true);
  try {
    return doFilter(state, condition, field, cellValue);
  } catch (error) {
    // FIXME: calc fields transform cause filter match error
    console.error(error);
    return false;
  }
};

/**
 * check whether a record match the filterCondition
 */
const checkConditions = (
  state: IReduxState,
  snapshot: ISnapshot,
  record: IRecord,
  filterInfo: IFilterInfo,
  repeatRows?: string[],
) => {
  const conditions = filterInfo.conditions;

  if (filterInfo.conjunction === FilterConjunction.And) {
    return conditions.every(condition => doFilterOperations(state, condition, snapshot, record));
  }

  if (filterInfo.conjunction === FilterConjunction.Or) {
    return conditions.some(condition => doFilterOperations(state, condition, snapshot, record, repeatRows));
  }

  throw new Error(t(Strings.error_wrong_conjunction_type, {
    conjunction: filterInfo.conjunction,
  }));
};

export function doFilter(state: IReduxState, condition: IFilterCondition, field: IField, cellValue: ICellValue) {
  const fieldMethod = Field.bindContext(field, state);
  /**
   *  isEmpty, isNotEmpty 
   *  call the common business logic
   */
  if (condition.operator === FOperator.IsEmpty || condition.operator === FOperator.IsNotEmpty) {
    return fieldMethod.isEmptyOrNot(condition.operator, cellValue);
  }

  /**
   * under the condition of not isEmpty or isNotEmpty,
   * if the value is not filled, then do not filter
   */
  if (condition.value == null && fieldMethod.basicValueType !== BasicValueType.Number && condition.operator !== FOperator.IsRepeat) {
    return true;
  }

  /**
   * call `field`'s own operator calculation function to calculate
   */
  return fieldMethod.isMeetFilter(condition.operator, cellValue, condition.value);
}

export const getFilterInfoExceptInvalid = (state: IReduxState, filterInfo?: IFilterInfo, datasheetId?: string) => {
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
    conditions: filterInfo.conditions.filter(condition => {
      const fieldMap = snapshot.meta.fieldMap;
      const field = fieldMap[condition.fieldId]!;

      if (!field) {
        return false;
      }
      return true;
    }),
  };
};

const getFilterRowsBase = (state: IReduxState, { filterInfo, rows, snapshot, recordMap }: { filterInfo?: IFilterInfo, rows: IViewRow[], snapshot: ISnapshot, recordMap: IRecordMap }) => {
  if (!filterInfo) {
    return rows;
  }

  const isRepeatCondition = filterInfo.conditions.find(condition => condition.operator === FOperator.IsRepeat);
  const isAnd = filterInfo.conjunction === FilterConjunction.And;
  let repeatRows: string[] | undefined;

  if (isRepeatCondition) {
    if (isAnd) {
      rows = findRepeatRow(state, snapshot, rows, isRepeatCondition.fieldId, true) as IViewRow[];
      set(filterInfo, 'conditions', filterInfo.conditions.filter(condition => condition.operator !== FOperator.IsRepeat));
    } else {
      repeatRows = findRepeatRow(state, snapshot, rows, isRepeatCondition.fieldId) as string[];
    }
  }
  const result = rows.filter(row => {
    return checkConditions(state, snapshot, recordMap[row.recordId], filterInfo, repeatRows);
  });
  return result;
};

export const getFilteredRows = (state: IReduxState, snapshot?: ISnapshot, view?: IViewProperty) => {
  if (!view || !snapshot) {
    return [];
  }
  const recordMap = snapshot.recordMap;
  const rows = view.rows.filter(row => recordMap[row.recordId]);

  // pass in `view`, because it has been processed by mirror, 
  // so the `filterInfo` we get may be the temporary data of mirror operation, 
  // so if we read it directly from `views`, 
  // we can't do data isolation for the source table
  const _filterInfo = state?.pageParams?.mirrorId ? snapshot.meta.views.find(item => item.id === view.id)!.filterInfo : view.filterInfo;
  const filterInfo = getFilterInfoExceptInvalid(state, _filterInfo, snapshot.datasheetId);
  const viewRows = getFilterRowsBase(state, { filterInfo, rows, snapshot, recordMap });

  /**
   * 
   * getVisibleRowsBase sometimes needs to process the data of the associated table,
   * if we judge the existence of mirror only, 
   * it will cause an error situation where the data source is the associated table and the filter condition is the local table.
   * 
   * so, here we need to judge whether the snapshot provided and the table bound by the mirror are the same
   * 
   */
  if (state?.pageParams?.mirrorId && state?.pageParams?.datasheetId === snapshot.datasheetId) {
    const mirror = getMirror(state, state.pageParams.mirrorId)!;
    const temporaryView = mirror.temporaryView;

    if (!temporaryView) {
      return viewRows;
    }

    const { filterInfo: mirrorFilterInfo } = temporaryView;
    return getFilterRowsBase(state, { filterInfo: mirrorFilterInfo, rows: viewRows, snapshot, recordMap });
  }

  return viewRows;
};

export const getGroupFields = (view: IViewProperty, fieldMap: { [id: string]: IField }, fieldPermissionMap?: IFieldPermissionMap): IField[] => {
  const fields: IField[] = [];
  view.groupInfo && view.groupInfo.forEach(gp => {
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, gp.fieldId);
    if (fieldRole === Role.None) {
      fields.push({
        id: gp.fieldId,
        type: FieldType.NotSupport,
        name: t(Strings.crypto_field),
        property: null,
      });
      return;
    }
    const field = fieldMap[gp.fieldId];
    if (field) {
      fields.push(field);
    } else {
      console.warn('! ' + `can't find group field ${gp.fieldId} on datasheet`);
    }
  });
  return fields;
};

/**
 * filter the duplicate cellValue, return the rows after de-duplication
 */
const findRepeatRow = (state: IReduxState, snapshot: ISnapshot, rows: IViewRow[], fieldId: string, isAnd?: boolean) => {
  const map = new Map();
  const field = snapshot.meta.fieldMap[fieldId];
  const fieldMethod = Field.bindContext(field, state);
  const values = DatasheetActions.getCellValuesByFieldId(state, snapshot, fieldId, undefined, true);
  if (values?.length) {
    for (const row of rows) {
      const needTranslate = [FieldType.Currency, FieldType.SingleText, FieldType.Text, FieldType.URL, FieldType.Phone, FieldType.Email,
        FieldType.DateTime, FieldType.CreatedTime, FieldType.LastModifiedTime, FieldType.Number, FieldType.Percent];
      let cellValue = getCellValue(state, snapshot, row.recordId, fieldId);
      const lookUpField = findRealField(state, field);
      const rollUpType = field.property?.rollUpType || RollUpFuncType.VALUES;
      const isNeedSort = Array.isArray(cellValue) && (
        (field.type === FieldType.LookUp && rollUpType === RollUpFuncType.VALUES) ||
        ([FieldType.MultiSelect, FieldType.Member].includes(field.type))
        || field.type === FieldType.Link
      );

      // whether or not to sort
      if (isNeedSort) {
        cellValue = sortBy(cellValue as any[], o => typeof o === 'object' ? o.text : o) as ICellValue;
      }
      // whether or not call cellValueToString to convert to string
      if (needTranslate.includes(field.type) ||
        (FieldType.LookUp === field.type && lookUpField &&
          ![FieldType.SingleSelect, FieldType.MultiSelect, FieldType.Link].includes(lookUpField.type))
      ) {
        cellValue = fieldMethod.cellValueToString(cellValue, { hideUnit: true }) || '';
      }
      cellValue = cellValue?.toString().trim() || '';
      if (!map.has(cellValue)) {
        map.set(cellValue, [row.recordId]);
        continue;
      }
      map.set(cellValue, [...map.get(cellValue), row.recordId]);
    }
  }
  const result: string[] = [];
  map.forEach(value => {
    if (value.length > 1) {
      result.push(...value);
    }
  });
  if (isAnd) {
    const recordIdMap = new Map(result.map((value, key) => [value, key]));
    return rows.filter(row => recordIdMap.has(row.recordId));
  }
  return result;
};

type RealFieldReturn<T extends IField> = T extends ILookUpField ? IField | undefined : never;

export const findRealField = <T extends IField>(state: IReduxState, propsField: T) => {
  if (propsField.type !== FieldType.LookUp) {
    return propsField;
  }
  return Field.bindContext(propsField, state).getLookUpEntityField() as RealFieldReturn<T>;
};

export const getKanbanGroupMapBase = (
  rows: IViewRow[], kanbanFieldId?: string, snapshot?: ISnapshot, fieldPermissionMap?: IFieldPermissionMap,
) => {
  if (!kanbanFieldId) {
    return;
  }

  const recordMap = snapshot!.recordMap;
  const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  if (fieldRole === Role.None) {
    return {
      UN_GROUP: rows.map(row => {
        return recordMap[row.recordId];
      }),
    };
  }

  const fieldMap = snapshot!.meta.fieldMap;
  const field = fieldMap[kanbanFieldId];
  const groupMap = getGroupValueMap(field);

  for (const { recordId } of rows) {
    const record = recordMap[recordId];
    if (!record) {
      console.warn('! ' + `${recordId} is not exist,check kanban data`);
      continue;
    }
    const fieldData = record.data[kanbanFieldId];

    if (fieldData == null) {
      groupMap[UN_GROUP].push(record);
      continue;
    }
    try {

      if (field.type === FieldType.Member) {
        const id = MemberField.polyfillOldData(fieldData as IUnitIds)?.[0];
        id && groupMap[id].push(record);

        continue;
      }

      groupMap[fieldData as string].push(record);
    } catch (e) {
      console.warn('! ' + `${fieldData} is not exist,check kanban data`);
    }
  }

  return groupMap;
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

const getGroupValueMap = (field: IField) => {
  let sourceData: string[] = [];
  if (field.type === FieldType.SingleSelect) {
    sourceData = field.property.options.map(item => item.id);
  } else {
    sourceData = (field as IMemberField).property.unitIds || [];
  }
  return sourceData.reduce<{ [key: string]: IRecord[] }>((map, item) => {
    map[item] = [];
    return map;
  }, { [UN_GROUP]: [] });
};

export const getGroupInfoWithPermission = (state: IReduxState, groupInfo: IGroupInfo, datasheetId?: string) => {
  const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
  if (!groupInfo || !fieldPermissionMap) {
    return groupInfo;
  }
  return groupInfo.filter(group => {
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, group.fieldId);

    if (fieldRole === Role.None) {
      return false;
    }

    return true;
  });
};

export const getFormulaCellValue = (
  state: IReduxState,
  field: IFormulaField,
  record: IRecord,
  withError?: boolean,
): ICellValue => {
  return evaluate(field.property.expression, { field, record, state }, withError, false);
};

export const getComputeCellValue = (
  state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string, withError?: boolean,
) => {
  const recordMap = snapshot.recordMap;
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  const record = recordMap[recordId];

  if (!field || !record) {
    return null;
  }
  switch (field.type) {
    case FieldType.Formula: {
      return getFormulaCellValue(state, field as IFormulaField, record, withError);
    }
    case FieldType.LookUp: {
      return Field.bindContext(field, state).getCellValue(recordId, withError);
    }
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime: {
      if (!record) {
        return null;
      }
      return (Field.bindContext(field, state) as IAutomaticallyField).getCellValue(record);
    }
    case FieldType.AutoNumber: {
      if (!record) {
        return null;
      }
      return (Field.bindContext(field, state) as any).getCellValue(record, fieldId);
    }
    default:
      return null;
  }
};

/**
 * 
 * non-calc field value, get by record.data and fieldId
 * 
 * @param state 
 * @param snapshot 
 * @param recordId 
 * @param fieldId 
 * @param datasheetId 
 * @returns 
 */
export const getEntityCellValue = (
  state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string, datasheetId?: string,
) => {
  const recordMap = snapshot.recordMap;
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  // TODO: if cannot find this id when get entity cell value, 
  // it means that the server missed the data. The frontend needs to add a remedy to actively load the missing fields.
  if (!recordMap[recordId] && datasheetId) {
    const client = state.datasheetMap[datasheetId]?.client;
    const loadingRecord = client?.loadingRecord;
    if (!loadingRecord?.[recordId]) {
      dataSelfHelper.addRecord(datasheetId, recordId, fieldId);
    }
  }
  const recordData = recordMap[recordId] && recordMap[recordId].data;
  if (!field || !recordData) {
    return null;
  }
  let cv = recordData[fieldId];
  cv = handleEmptyCellValue(cv, Field.bindContext(field, state).basicValueType);
  return cv;
};

export const _getLookUpTreeValue = (
  state: IReduxState,
  snapshot: ISnapshot,
  recordId: string,
  fieldId: string,
  datasheetId?: string,
) => {
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  if (!field) {
    return null;
  }
  if (Field.bindContext(field, state).isComputed) {
    if (field.type === FieldType.LookUp) {
      return new LookUpField(field, state).getLookUpTreeValue(recordId);
    }
    return getComputeCellValue(state, snapshot, recordId, fieldId);
  }
  return getEntityCellValue(state, snapshot, recordId, fieldId, datasheetId);
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

export const getFieldMap = createCachedSelector<IReduxState,
  string | void, undefined | IDatasheetState | null, IFieldPermissionMap | undefined, IFieldMap | null | undefined>(
    [getDatasheet, getFieldPermissionMap],
    getFieldMapBase,
  )(defaultKeySelector);

export const getFieldMapIgnorePermission = createCachedSelector<IReduxState,
  string | void, undefined | IDatasheetState | null, IFieldMap | null | undefined>(
    [getDatasheet],
    getFieldMapBase,
  )(defaultKeySelector);

/**
 * magic links filter record ids
 * @param state
 * @param snapshot
 * @param records
 * @param filterInfo
 * @returns string[]
 */
export const getFilteredRecords = (state: IReduxState, snapshot: ISnapshot, records: ILinkIds, filterInfo?: IFilterInfo) => {
  if (!records || !snapshot) {
    return [];
  }
  const _filterInfo = getFilterInfoExceptInvalid(state, filterInfo, snapshot.datasheetId);

  if (!_filterInfo) {
    return records;
  }

  const { recordMap } = snapshot;
  const result = records.filter(recordId => {
    if (!recordMap[recordId]) {
      return false;
    }
    return checkConditions(state, snapshot, recordMap[recordId], _filterInfo!);
  });
  return result;
};

export const calcCellValueAndString = (
  {
    state,
    snapshot,
    fieldId,
    recordId,
    datasheetId,
    withError,
    ignoreFieldPermission,
  }: {
    state: IReduxState,
    snapshot: IRecordSnapshot,
    fieldId: string,
    recordId: string,
    datasheetId?: string,
    withError?: boolean,
    ignoreFieldPermission?: boolean
  },
): {
  cellValue: any,
  cellStr: any,
  ignoreCache?: boolean
} => {
  const cellValue = calcCellValue(state, snapshot, fieldId, recordId, withError, datasheetId, ignoreFieldPermission);
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  if (cellValue == null) {
    return {
      cellValue,
      cellStr: null,
      ignoreCache: true,
    };
  }
  if (field.type === FieldType.Attachment) {
    return {
      cellStr: (cellValue as IAttachmentValue[]).map(item => item.name).join(','),
      cellValue,
      ignoreCache: workerCompute() ? false : true,
    };
  }
  const instance = Field.bindContext(field, state);
  return {
    cellValue,
    cellStr: instance.cellValueToString(cellValue),
    ignoreCache: workerCompute() ? false : !instance.isComputed
  };
};

export const getStringifyCellValue = (
  state: IReduxState,
  snapshot: IRecordSnapshot,
  recordId: string,
  fieldId: string,
  _withFilter?: boolean,
  withError?: boolean,
) => {
  const dsId = snapshot.datasheetId || state.pageParams.datasheetId;
  if (!dsId) {
    return calcCellValueAndString({ state, snapshot, recordId, fieldId, withError }).cellStr;
  }
  let cacheValue = CacheManager.getCellCache(dsId, fieldId, recordId);
  if (cacheValue !== NO_CACHE) {
    return cacheValue.cellStr;
  }
  cacheValue = calcCellValueAndString(
    { state, snapshot, recordId, fieldId, withError, datasheetId: dsId }
  );

  if (!(cacheValue as any).ignoreCache) {
    CacheManager.setCellCache(dsId, fieldId, recordId, cacheValue);
  }

  return cacheValue.cellStr;
};

const getSearchResultType = (view?: IViewProperty) => {
  if (!view) {
    return SearchResultType.Cell;
  }
  switch (view.type) {
    case ViewType.Grid:
    case ViewType.Gantt:
      return SearchResultType.Cell;
    case ViewType.Gallery:
    case ViewType.Kanban:
    default:
      return SearchResultType.Record;
  }
};

const getHiddenKey = (view?: IViewProperty) => {
  switch (view?.type) {
    case ViewType.Gantt:
      return 'hiddenInGantt';
    case ViewType.Calendar:
      return 'hiddenInCalendar';
    case ViewType.OrgChart:
      return 'hiddenInOrgChart';
    default:
      return 'hidden';
  }
};

export const calcSearchRowsAndItems = (state: IReduxState, snapshot: ISnapshot, rows: IViewRow[], view?: IViewProperty, searchKeyword?: string) => {
  if (!searchKeyword) {
    return { visibleRows: rows, items: null };
  }
  const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
  const cacheKey = `SEARCH_${lowerCaseSearchKeyword}`;
  const searchResultType = getSearchResultType(view);
  const searchResultArray: ISearchResult = [];
  const hiddenKey = getHiddenKey(view);
  const visibleColumns = !view ? [] : view.columns.filter(item => !item[hiddenKey]).map(item => item.fieldId);
  const visibleRows = rows.filter(row => {
    const { recordId } = row;
    let isRecordDataMatchKeyword = false;
    visibleColumns.forEach(fieldId => {
      const cellValue = getStringifyCellValue(state, snapshot, recordId, fieldId, true);
      if (cellValue && cellValue.toLowerCase().includes(lowerCaseSearchKeyword)) {
        if (searchResultType === SearchResultType.Cell) {
          (searchResultArray as ISearchCellResult).push([recordId, fieldId]);
        }
        isRecordDataMatchKeyword = true;
      }
    });
    if (isRecordDataMatchKeyword && searchResultType === SearchResultType.Record) {
      (searchResultArray as ISearchRecordResult).push(recordId);
    }
    return isRecordDataMatchKeyword;
  });
  computeCache.set(cacheKey, searchResultArray);
  return { visibleRows, items: searchResultArray };
};

export const getSearchRows = (state: IReduxState, snapshot: ISnapshot, rows: IViewRow[], view?: IViewProperty, searchKeyword?: string) => {
  return calcSearchRowsAndItems(state, snapshot, rows, view, searchKeyword).visibleRows;
};

export function sortRowsBySortInfo(state: IReduxState, rows: IViewRow[], sortRules: ISortedField[], snapshot: ISnapshot) {
  const shallowRows = [...rows];
  shallowRows.sort((prev, current) => {
    return sortRules.reduce((acc, rule) => {
      const field = snapshot.meta.fieldMap[rule.fieldId];
      // TODO: temp code online, when merge to develop, delete this
      if (!field || acc !== 0) {
        return acc;
      }
      const fieldMethod = Field.bindContext(field, state);

      // same as filter, sort remove the check of column permission
      const cv1 = getCellValue(state, snapshot, prev.recordId, field.id, undefined, undefined, true);
      const cv2 = getCellValue(state, snapshot, current.recordId, field.id, undefined, undefined, true);
      const res = fieldMethod.compare(
        cv1,
        cv2,
        true,
      );
      const sign = rule.desc ? -1 : 1;
      return res * sign;
    }, 0);
  });

  return shallowRows;
}

function getKeepSortRows(state: IReduxState, view: IViewProperty, snapshot: ISnapshot, rows: IViewRow[]) {
  if (!view?.sortInfo || !view.sortInfo.keepSort) {
    return rows;
  }
  return sortRowsBySortInfo(state, rows, view.sortInfo.rules, snapshot);
}

/**
 * the sort on search result
 * 
 * @param {IReduxState} state
 * @param {IViewProperty} view
 * @param {ISnapshot} snapshot
 * @param {IViewRow[]} rows
 * @returns {IViewRow[]}
 */
const getSortRowsByKanbanGroup = (state: IReduxState, view: IViewProperty, snapshot: ISnapshot, rows: IViewRow[]): IViewRow[] => {
  if (!view || view.type !== ViewType.Kanban) {
    return rows;
  }
  const kanbanFieldId = view?.style.kanbanFieldId;
  if (!kanbanFieldId) {
    return rows;
  }
  const field = snapshot.meta.fieldMap![kanbanFieldId];
  if (!field) {
    return rows;
  }

  const fieldPermission = getFieldPermissionMap(state, snapshot.datasheetId);

  if (getFieldRoleByFieldId(fieldPermission, kanbanFieldId) === Role.None) {
    // kanbanFieldId, if set permission, and not visible to current user, no need to handle the following logic
    return rows;
  }
  const kanbanGroupMap = getKanbanGroupMapBase(rows, kanbanFieldId, snapshot);
  if (!kanbanGroupMap) {
    return rows;
  }
  const groupIds = field.type === FieldType.SingleSelect
    ? field.property.options.map(item => item.id)
    : (field as IMemberField).property.unitIds;
  if (!Array.isArray(groupIds)) {
    return rows;
  }
  const flatRows = [UN_GROUP, ...groupIds].map(groupId => {
    if (!kanbanGroupMap[groupId]) {
      return [];
    }
    return kanbanGroupMap[groupId].map(record => ({ recordId: record.id }));
  }).flat();
  return flatRows;
};

export const getSortRowsByGroup = (state: IReduxState, view: IViewProperty, snapshot: ISnapshot, rows: IViewRow[]) => {
  if (!view || !snapshot) {
    return [];
  }
  const fieldMap = snapshot.meta.fieldMap;
  if (!view.groupInfo) {
    return rows;
  }
  const fieldPermissionMap = getFieldPermissionMap(state);
  const groups = getGroupFields(view, snapshot.meta.fieldMap, fieldPermissionMap);
  if (!groups.length) {
    return rows;
  }
  const descOrders = view.groupInfo.reduce((acc, gp) => {
    if (fieldMap[gp.fieldId]) {
      acc.push(gp.desc);
    }
    return acc;
  }, [] as boolean[]);

  // rows, sort by group
  return rows.sort((row1, row2) => {
    return groups.reduce((prev, field, index) => {
      if (prev !== 0) {
        return prev;
      }
      const cv1 = getCellValue(state, snapshot, row1.recordId, field.id);
      const cv2 = getCellValue(state, snapshot, row2.recordId, field.id);
      const res = Field.bindContext(field, state).compare(cv1, cv2);
      const sign = descOrders[index] ? -1 : 1;
      return res * sign;
    }, 0) || 1;
  });
};

export const getVisibleRowsBaseComputed = (state: IReduxState, snapshot?: ISnapshot, view?: IViewProperty) => {
  // where,  match by fields
  const filteredRows = getFilteredRows(state, snapshot, view).filter(item => !item.hidden);
  // order by
  const sortedRows = getKeepSortRows(state, view!, snapshot!, filteredRows);
  // group by
  let groupedRows = getSortRowsByGroup(state, view!, snapshot!, sortedRows);
  // search orders under kanban view
  groupedRows = getSortRowsByKanbanGroup(state, view!, snapshot!, groupedRows);

  // calc active records whether is offset

  return groupedRows;
};

// visible rows in data layer
export const getVisibleRowsBase = (state: IReduxState, snapshot?: ISnapshot, view?: IViewProperty, searchKeyword?: string) => {
  if (!snapshot || !view) {
    return [];
  }
  const mirrorId = state?.pageParams?.mirrorId;
  const isMirror = mirrorId && state?.pageParams?.datasheetId === snapshot.datasheetId;
  let cache;
  if (isMirror) {
    cache = visibleRowsBaseCacheManage.getMirror(mirrorId!);
  } else {
    cache = visibleRowsBaseCacheManage.get(snapshot.datasheetId, view.id);
  }
  if (cache) {
    return getSearchRows(state, snapshot!, cache, view, searchKeyword);
  }
  /**
   * 
   * first time, if no cache, it means the first time to load, then add to subscribe pool
   * otherwise, cache expired, then recalculate cache
   * 
   */
  const visibleRowsBase = cache || getVisibleRowsBaseComputed(state, snapshot, view);
  if (isMirror) {
    visibleRowsBaseCacheManage.setMirror(mirrorId!, snapshot.datasheetId, view.id, visibleRowsBase);
  } else {
    visibleRowsBaseCacheManage.set(snapshot.datasheetId, view.id, visibleRowsBase);
  }
  /**
   * 
   * !!! first, filter and sort, sort performance is better. But to ensure the order of search results,
   * need to execute full-text search after sorting.
   * 
   * during the search process, the search result will be cached at one time, used to switch the search result.
   * 
   */

  // global, match by text accurately
  return getSearchRows(state, snapshot!, visibleRowsBase, view, searchKeyword);
};

export const getPureVisibleRows = createCachedSelector<IReduxState,
  string | void,
  IViewRow[] | undefined,
  IReduxState,
  ISnapshot | undefined,
  IViewProperty | undefined,
  string | undefined,
  IViewRow[]>(
    [getPureVisibleRowsFormComputed, state => state, getSnapshot, getCurrentView, getSearchKeyword],
    (cacheRows, ...params) => {
      if (cacheRows) {
        return cacheRows;
      }
      return getVisibleRowsBase(...params);
    },
  )({
    selectorCreator: createSelectorIgnoreState,
    keySelector: defaultKeySelector,
  });

export const getVisibleRowsIndexMapBase = (visibleRows: IViewRow[]) => {
  return new Map(visibleRows?.map((item, index) => [item.recordId, index]));
};

export const getPureVisibleRowsIndexMap = createSelector([getPureVisibleRows], getVisibleRowsIndexMapBase);

export const getRowsIndexMap = createSelector<IReduxState, string | void, IViewProperty | undefined, Map<string, number>>(
  [getCurrentView], view => {
    if (!view) {
      return new Map();
    }
    return new Map(view.rows.map((item, index) => [item.recordId, index]));
  });

export const getColumnIndexMap = createSelector<IReduxState, string | void, IViewProperty | undefined, { [id: string]: number }>(
  [getCurrentView], view => {
    const columnsMap: { [id: string]: number } = {};
    if (!view) {
      return columnsMap;
    }
    for (const [k, v] of view.columns.entries()) {
      columnsMap[v.fieldId] = k;
    }
    return columnsMap;
  });

export const getVisibleColumns = createCachedSelector<IReduxState,
  string | void,
  IViewProperty | void | null,
  IFieldPermissionMap | undefined,
  IViewColumn[]>(
    [getCurrentView, getFieldPermissionMap],
    (view?: IViewProperty, fieldPermissionMap?) => {
      // ignore the first column as hidden
      return view ? view.columns.filter((item, i) => {
        const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
        if (fieldRole === Role.None) {
          return false;
        }
        return !(item.hidden && i !== 0);
      }) : [];
    },
  )(defaultKeySelector);

export const getVisibleColumnsMap = createSelector([getVisibleColumns], columns => {
  return new Map(columns.map((item, index) => [item.fieldId, index]));
});

export const findColumnIndexById = (state: IReduxState, id: string): number => {
  const columnsMap = getVisibleColumnsMap(state);
  const index = columnsMap.get(id);
  if (!isNumber(index)) {
    throw new Error(t(Strings.error_not_exist_id, {
      id,
    }));
  }
  return index;
};

// reselect for non-frozen columns
export const getExceptFrozenColumns = createSelector(
  [getVisibleColumns, getCurrentView],
  (columns: IGridViewColumn[], view?: IViewProperty) => {
    return (!view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt)) ? [] : columns.slice(view.frozenColumnCount);
  },
);

// reselect for frozen columns
export const getFrozenColumns = createSelector(
  [getVisibleColumns, getCurrentView],
  (columns: IGridViewColumn[], view?: IViewProperty) => {
    return (!view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt)) ? [] : columns.slice(0, view.frozenColumnCount);
  },
);

// TODO: memory special attention
const getStdValueMatrixFromIds = (
  state: IReduxState,
  snapshot: ISnapshot,
  ids: { rows: IViewRow[]; columns: IViewColumn[] },
): IStandardValue[][] => {
  const { rows, columns } = ids;
  return rows.map(row => {
    const recordId = row.recordId;
    return columns.map(column => {
      const fieldId = column.fieldId;
      const field = snapshot.meta.fieldMap[fieldId];
      const cellValue = getCellValue(state, snapshot, recordId, fieldId);
      return Field.bindContext(field, state).cellValueToStdValue(cellValue);
    });
  });
};

const getCellMatrix = (
  rows: IViewRow[],
  columns: IViewColumn[],
): ICell[][] => {
  return rows.map(row => {
    const recordId = row.recordId;
    return columns.map(column => {
      const fieldId = column.fieldId;
      return { recordId, fieldId };
    });
  });
};

// get current active view's filter info
export const getActiveViewFilterInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  if (!view?.filterInfo) {
    return null;
  }
  return view.filterInfo;
});

// get current active view's sort info
export const getActiveViewSortInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  return view?.sortInfo;
});

// get current active view's group info
export const getActiveViewGroupInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  if (!view?.groupInfo) {
    return [];
  }
  return view.groupInfo;
});

export const getRecordMoveType = createSelectorIgnoreState(
  [state => state, getPureVisibleRowsIndexMap, getActiveRecordId],
  (state: IReduxState, visibleRowsIndexMap, recordId) => {
    // getPureVisibleRows, get the newest visibleRows;
    const NOT_MOVE = RecordMoveType.NotMove;
    const datasheetId = getActiveDatasheetId(state);
    if (!datasheetId || !recordId) {
      return NOT_MOVE;
    }
    const snapshot = getSnapshot(state, datasheetId)!;
    const activeRowInfo = getActiveRowInfo(state);
    if (!activeRowInfo) {
      return NOT_MOVE;
    }
    const { positionInfo, type = WhyRecordMoveType.UpdateRecord } = activeRowInfo;
    const nextVisibleRowIndex = visibleRowsIndexMap.get(recordId);
    if (positionInfo.isInit) {
      return NOT_MOVE;
    }
    if (type === WhyRecordMoveType.NewRecord) {
      if (!visibleRowsIndexMap.has(recordId)) {
        // if not exist in current view, but exist in recordMap, means filtered
        if (recordId in snapshot.recordMap) {
          return RecordMoveType.OutOfView;
        }
        // if not exit in current view, and not exist in recordMap, means deleted
        return NOT_MOVE;
      }
      if (nextVisibleRowIndex !== positionInfo.visibleRowIndex) {
        return RecordMoveType.WillMove;
      }
    }

    // judge earlier to reduce unnecessary calculation
    if (nextVisibleRowIndex === positionInfo.visibleRowIndex) {
      return NOT_MOVE;
    }
    const { recordSnapshot } = activeRowInfo as IActiveUpdateRowInfo;
    const nextRecordSnapshot = getRecordSnapshot(state, recordId);

    // records to delete
    if (!nextRecordSnapshot) {
      return RecordMoveType.Deleted;
    }
    const isRecordEffectPositionCellValueChanged = (
      recordSnapshot: IRecordSnapshot,
      nextRecordSnapshot: IRecordSnapshot,
    ) => {
      const view = getCurrentView(state)!;
      const fieldMap = getFieldMap(state)!;
      const fieldPermissionMap = getFieldPermissionMap(state);
      const groupField = getGroupFields(view, fieldMap, fieldPermissionMap);
      const filterInfo = getActiveViewFilterInfo(state);
      const sortInfo = getActiveViewSortInfo(state);

      // write down whether happened pre-sort, decided by group, filter, sort fields which auto sort is enabled
      const fieldsWhichMakeRecordMove: string[] = groupField.map(field => field.id);
      if (sortInfo?.keepSort) {
        sortInfo?.rules.forEach(rule => fieldsWhichMakeRecordMove.push(rule.fieldId));
      }
      filterInfo?.conditions.forEach(cond => fieldsWhichMakeRecordMove.push(cond.fieldId));
      const _fieldsWhichMakeRecordMove = [...new Set(fieldsWhichMakeRecordMove)].filter(fieldId => {
        const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        return fieldRole !== Role.None;
      });
      return _fieldsWhichMakeRecordMove.some(fieldId => {
        /**
         * 
         * getCellValue, the argument recordSnapshot will not take effect on formula, formula always get the newest value.
         * so, store the value of formula field in the old recordSnapshot, to handle the case of formula field pre-sort.
         */
        const field = fieldMap[fieldId];
        let cv1 = recordSnapshot.recordMap[recordId]?.data[fieldId];
        cv1 = handleEmptyCellValue(cv1, Field.bindContext(field, state).basicValueType);
        const cv2 = getCellValue(state, nextRecordSnapshot, recordId, fieldId);
        return !Field.bindContext(field, state).eq(cv1, cv2);
      });
    };
    const isSearching = getIsSearching(state);
    // non-searching state, only when specified fields' value changed, record will pre-order.
    if (!isSearching && !isRecordEffectPositionCellValueChanged(recordSnapshot, nextRecordSnapshot)) {
      return NOT_MOVE;
    }
    if (nextVisibleRowIndex == null && nextRecordSnapshot) {
      return RecordMoveType.OutOfView;
    }
    if (nextVisibleRowIndex !== positionInfo.visibleRowIndex) {
      return RecordMoveType.WillMove;
    }
    return NOT_MOVE;
  });

const getVisibleRowsInner = (
  state: IReduxState, visibleRows: IViewRow[], recordMoveType: RecordMoveType, activeRowInfo: ReturnType<typeof getActiveRowInfo>,
) => {
  if (!visibleRows) {
    return [];
  }
  if (!activeRowInfo) {
    return visibleRows;
  }
  const { positionInfo: { recordId, visibleRowIndex }} = activeRowInfo;
  const snapshot = getSnapshot(state);
  const nextVisibleRows = produce(visibleRows, draftVisibleRows => {
    if ([RecordMoveType.OutOfView, RecordMoveType.WillMove].includes(recordMoveType)) {
      if (RecordMoveType.WillMove === recordMoveType) {
        const nextVisibleRowIndex = draftVisibleRows.findIndex(row => row.recordId === recordId);
        draftVisibleRows.splice(nextVisibleRowIndex, 1);
      }
      // only insert when record still exist
      if (snapshot && snapshot?.recordMap[recordId]) {
        draftVisibleRows.splice(visibleRowIndex, 0, { recordId });
      }
    }
    return draftVisibleRows;
  });
  return nextVisibleRows;
};

export const getVisibleRows = createSelectorIgnoreState(
  [state => state, getPureVisibleRows, getRecordMoveType, getActiveRowInfo],
  getVisibleRowsInner,
);

export const getKanbanGroupMap = createSelector([
  getVisibleRows,
  getKanbanFieldId,
  getSnapshot,
  getFieldPermissionMap,
], getKanbanGroupMapBase);

export const getVisibleRowIds = createSelector([getVisibleRows], (visibleRows) => {
  return visibleRows.map(row => row.recordId);
});

export const getRangeFields = (state: IReduxState, range: IRange, datasheetId: string): IField[] | null => {
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const columnSlice = [rangeIndex.field.min, rangeIndex.field.max + 1];
  const columns = getVisibleColumns(state);
  return columns.slice(...columnSlice).map(col => getField(state, col.fieldId, datasheetId));
};

export const getRangeRecords = (state: IReduxState, range: IRange): IViewRow[] | null => {
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const rowSlice = [rangeIndex.record.min, rangeIndex.record.max + 1];
  const rows = getVisibleRows(state);
  return rows.slice(...rowSlice);
};

export const getRecordSnapshot = (state: IReduxState, recordId: string): IRecordSnapshot | null => {
  const snapshot = getSnapshot(state);
  const fieldMap = getFieldMap(state);
  if (!snapshot || !fieldMap) {
    return null;
  }
  const record = getRecord(state, recordId);
  if (!record) {
    return null;
  }
  return {
    meta: { fieldMap },
    recordMap: {
      [recordId]: record,
    },
    datasheetId: snapshot.datasheetId,
  };
};

export const getVisibleRowsIndexMap = createSelector([getVisibleRows], getVisibleRowsIndexMapBase);

export const isCellVisible = (state: IReduxState, cell: ICell) => {
  const visibleRowIndexMap = getVisibleRowsIndexMap(state);
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  return visibleRowIndexMap.has(cell.recordId) && visibleColumnIndexMap.has(cell.fieldId);
};

export const getSelection = (state: IReduxState) => {
  const client = getDatasheetClient(state);
  const selection = client && client.selection;

  // whether activeCell move out
  if (selection && selection.activeCell && !(isCellVisible(state, selection.activeCell))) {
    return null;
  }
  // the start of the selection area and the end of the selection area are removed
  if (selection && selection.ranges) {
    const { start, end } = selection.ranges[0];
    if (!isCellVisible(state, start) || !isCellVisible(state, end)) {
      return null;
    }
  }
  return selection;
};

export const getSelectRanges = createSelector([getSelection], selection => {
  if (!selection || !selection.ranges) {
    return [];
  }
  return selection.ranges;
});

export const getSelectionRecordRanges = createSelector([getSelection], selection => {
  return selection ? selection.recordRanges : undefined;
});

/**
 * from sequential or non-sequential selection area, get selected cells 2d array.
 * @param state
 */
export const getCellMatrixFromSelection = (state: IReduxState): ICell[][] | null => {
  const selectionRanges = getSelectRanges(state);
  const selectionRecordRanges = getSelectionRecordRanges(state);

  // non-sequence selection
  if (selectionRecordRanges) {
    const visibleColumns = getVisibleColumns(state);
    return selectionRecordRanges.map(recordId => {
      return visibleColumns.map(column => {
        return {
          recordId,
          fieldId: column.fieldId,
        };
      });
    });
  }
  // sequence selection
  if (!selectionRanges.length) {
    return null;
  }
  return getCellMatrixFromRange(state, selectionRanges[0]);
};

export const getCellMatrixFromRange = (
  state: IReduxState,
  range: IRange,
): ICell[][] | null => {
  const datasheet = getDatasheet(state);
  const snapshot = datasheet && datasheet.snapshot;
  if (!snapshot) {
    return null;
  }
  const view = getCurrentView(state);
  if (!view) {
    return null;
  }
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const { record, field } = rangeIndex;
  const rowSlice = [record.min, record.max + 1];
  const columnSlice = [field.min, field.max + 1];
  const rows = getVisibleRows(state).slice(...rowSlice);
  const columns = getVisibleColumns(state).slice(...columnSlice);
  return getCellMatrix(rows, columns);
};

export const getStdValueTableFromRange = (
  state: IReduxState,
  range: IRange,
): IStandardValueTable | null => {
  const datasheet = getDatasheet(state);
  const snapshot = datasheet && datasheet.snapshot;
  if (!snapshot) {
    return null;
  }
  const view = getCurrentView(state);
  if (!view) {
    return null;
  }
  const indexRange = Range.bindModel(range).getIndexRange(state);
  if (!indexRange) {
    return null;
  }
  const { record, field } = indexRange;
  const rowSlice = [record.min, record.max + 1];
  const columnSlice = [field.min, field.max + 1];
  const rows = getVisibleRows(state).slice(...rowSlice);
  const columns = getVisibleColumns(state).slice(...columnSlice);
  const stdValueMatrix = getStdValueMatrixFromIds(state, snapshot, { rows, columns });
  const fieldDataArr = columns.map(column => snapshot.meta.fieldMap[column.fieldId]);
  return {
    datasheetId: state.pageParams.datasheetId,
    viewId: view.id,
    header: fieldDataArr,
    body: stdValueMatrix,
    recordIds: rows.map(row => row.recordId),
  };
};

export const getVisibleRowCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view) {
    return -1;
  }
  return getVisibleRows(state).length;
};

export const getVisibleColumnCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view) {
    return -1;
  }
  return getVisibleColumns(state).length;
};

export const getRangeRows = (state: IReduxState, start: number, end: number) => {
  const view = getCurrentView(state);
  if (!view) {
    return [];
  }
  const rows = getVisibleRows(state);
  const groupInfo = getActiveViewGroupInfo(state);
  if (groupInfo.length) {
    const groupSketch = new Group(groupInfo, getGroupBreakpoint(state));
    const depthBreakpoints = groupSketch.getDepthGroupBreakPoints();
    const curBreakpoint = depthBreakpoints.find(bp => bp > start);
    return rows.slice(start, curBreakpoint ? Math.min(curBreakpoint, end) : end);
  }
  return rows.slice(start, end);
};

export const isRowSpaceEnough = (state: IReduxState, length: number, startRowIndex: number) => {
  // consider the grouping situation, we need to know whether the current grouping has enough space to paste data
  const rowLength = getVisibleRows(state).length;
  if (rowLength <= 0) {
    return false;
  }
  return length <= getRangeRows(state, startRowIndex, rowLength).length;
};

export const isColumnSpaceEnough = (state: IReduxState, length: number, activeCol: number) => {
  const columnLength = getVisibleColumnCount(state);
  return length <= columnLength - activeCol;
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
  return columns.find(column => column.fieldId === fieldId);
};

export const getRowHeightFromLevel = (level?: RowHeightLevel): number => {
  return level == null ? RowHeight.Short : RowHeight[RowHeightLevel[level]];
};

/**
 * get selected records collection, no matter by checkbox or range selection
 * @param state
 */
export const getSelectRecordIds = createSelectorIgnoreState(
  [state => state, getSelectRanges, getSelectionRecordRanges],
  (state, ranges, checkedRecordIds) => {
    const range = ranges[0];
    // if selection area exists, return the selected records in the area
    if (range) {
      const rangeRecords = getRangeRecords(state, range);
      return rangeRecords ? rangeRecords.map(row => row.recordId) : [];
    }
    // otherwise return the checked records
    return checkedRecordIds || [];
  });

export const isCellInSelection = (state: IReduxState, cell: ICell): boolean => {

  const selection = getSelection(state);
  if (!selection) {
    return false;
  }
  if (!selection.ranges) {
    const selectedRecordIds = getSelectRecordIds(state);
    const inSelectRecords = new Set(selectedRecordIds).has(cell.recordId);
    return inSelectRecords;
  }
  return selection.ranges.some(range => {
    return Range.bindModel(range).contains(state, cell);
  });
};

export const getCellIndex = (state: IReduxState, cell: ICell): { recordIndex: number, fieldIndex: number } | null => {
  const visibleRowIndexMap = getVisibleRowsIndexMap(state);
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  if (isCellVisible(state, cell)) {
    return {
      recordIndex: visibleRowIndexMap.get(cell.recordId)!,
      fieldIndex: visibleColumnIndexMap.get(cell.fieldId)!,
    };
  }
  return null;
};

export const getCellByIndex = (state: IReduxState, cellIndex: {
  recordIndex: number; fieldIndex: number
}) => {
  const { recordIndex, fieldIndex } = cellIndex;
  const visibleRows = getVisibleRows(state);
  const visibleColumns = getVisibleColumns(state);
  const cell = {
    recordId: visibleRows[recordIndex].recordId,
    fieldId: visibleColumns[fieldIndex].fieldId,
  };
  if (isCellVisible(state, cell)) {
    return cell;
  }
  return null;
};

export const getFixedCellValue = (state: IReduxState, snapshot: ISnapshot, recordId: string, fieldId: string) => {
  if (!recordId) {
    return null;
  }
  const activeRecordId = getActiveRecordId(state);
  const _cv = getCellValue(state, snapshot, recordId, fieldId);
  if (activeRecordId !== recordId) {
    return _cv;
  }
  const recordMoveType = getRecordMoveType(state);
  if ([RecordMoveType.OutOfView, RecordMoveType.WillMove].includes(recordMoveType)) {
    const activeRowInfo = getActiveRowInfo(state);
    if (activeRowInfo) {
      const { recordSnapshot } = activeRowInfo;
      let cv = recordSnapshot.recordMap[recordId]?.data[fieldId];
      const field = getField(state, fieldId);
      cv = handleEmptyCellValue(cv, Field.bindContext(field, state).basicValueType);
      return cv;
    }
  }
  return getCellValue(state, snapshot, recordId, fieldId);
};

export const getGroupLevel = createSelector([getActiveViewGroupInfo], (groupInfo) => {
  return groupInfo.length;
});

function getLinearRowsBase(state: IReduxState, visibleRows: IViewRow[], groupInfo: IGroupInfo, groupingCollapseIds?: string[]) {
  const snapshot = getSnapshot(state)!;
  const res: ILinearRow[] = [];
  // init groupBreakpoint
  const groupSketch = new Group(groupInfo);
  const groupLevel = groupInfo.length;
  let preRow: IViewRow = { recordId: '' };
  const lastRow: IViewRow = { recordId: '' };
  const groupingCollapseSet: Map<string, boolean> = new Map(groupingCollapseIds && groupingCollapseIds.map((v) => [v, true]));
  let globalFilterDepth = Infinity;

  // the row number before the record, reset when grouping occurs.
  let displayRowIndex = 0;
  let groupHeadRecordId = '';

  // group exist, but no data, add a placeholder row.
  if (!visibleRows.length && groupInfo.length) {
    res.push({
      type: CellType.Blank,
      depth: 0,
      recordId: '',
    });
    res.push({
      type: CellType.Add,
      depth: 0,
      recordId: '',
    });
  }
  for (const [index, row] of [...visibleRows, lastRow].entries()) {
    let shouldGenGroupLinearRows = false;
    groupInfo.forEach((groupItem, groupItemIndex) => {
      const fieldId = groupItem.fieldId;
      const field = getField(state, fieldId);
      const cv1 = getFixedCellValue(state, snapshot, preRow.recordId, fieldId);
      const cv2 = getFixedCellValue(state, snapshot, row.recordId, fieldId);
      if (
        !row.recordId ||
        !preRow.recordId ||
        !(Field.bindContext(field, state).compare(cv1, cv2) === 0)
      ) {
        shouldGenGroupLinearRows = true;
        groupInfo.slice(groupItemIndex).forEach((groupItem, subIndex) => {
          groupSketch.addBreakpointAndSetGroupTab(groupItem.fieldId, index, row.recordId, subIndex + groupItemIndex);
        });
      }
    });
    if (shouldGenGroupLinearRows) {
      /**
       * rec1_0
       *  rec1_1
       *  rec2_1 -> current_record : when the loop run to here, groupTabIds is current grouping Ids, not the whole groupTabIds.
       * rec3_0
       *  rec3_1
       *  rec4_1
       */
      const groupTabIds = groupSketch.getAllGroupTabIds();
      displayRowIndex = 0;
      groupHeadRecordId = row.recordId;
      const { groupLinearRows, filterDepth } = groupSketch.genGroupLinearRows(
        index, row.recordId, preRow.recordId, groupingCollapseSet, globalFilterDepth, groupTabIds,
      );
      globalFilterDepth = filterDepth;
      res.push(...groupLinearRows);
    }
    preRow = row;
    if (row.recordId && groupLevel <= globalFilterDepth) {
      displayRowIndex++;
      res.push({
        type: CellType.Record,
        depth: groupLevel,
        recordId: row.recordId,
        displayIndex: displayRowIndex,
        groupHeadRecordId,
      });
    }
    if (!groupLevel && !row.recordId) {
      res.push({
        type: CellType.Add,
        depth: 0,
        recordId: '',
      });
    }
  }
  groupSketch.cacheGroupBreakpoint();
  return res;
}

/**
 * guide `react-window` to draw table's structured data, the hierarchy is reflected by depth.
 * 
 * [
 *    Blank 0
 *    GroupTab 0
 *      GroupTab 1
 *        GroupTab 2
 *          Record 3
 *        Add 2
 *        Blank 2
 *      Blank 1
 *    Blank 0
 * ]
 */
export const getLinearRows = createSelectorIgnoreState(
  [state => state, getLinearRowsFormComputed, getVisibleRows, getGroupingCollapseIds, getActiveViewGroupInfo],
  (state: IReduxState, computedLinearRows, visibleRows, groupingCollapseIds, groupInfo): ILinearRow[] => {
    if (computedLinearRows) {
      return computedLinearRows;
    }
    return getLinearRowsBase(state, visibleRows, groupInfo, groupingCollapseIds);
  });

export const getLinearRowsIndexMap = createSelector([getLinearRows], linearRows => {
  return new Map(linearRows.map((row, index) => [`${row.type}_${row.recordId}`, index]));
});

export const getCellUIIndex = (state: IReduxState, cell: ICell): { rowIndex: number, columnIndex: number } | null => {
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  const linearRowIndexMap = getLinearRowsIndexMap(state);
  if (isCellVisible(state, cell)) {
    return {
      rowIndex: linearRowIndexMap.get(`${CellType.Record}_${cell.recordId}`)!,
      columnIndex: visibleColumnIndexMap.get(cell.fieldId)!,
    };
  }
  return null;
};

export const getSelectedField = (state: IReduxState) => {
  const selection = getSelection(state);
  const datasheet = getDatasheet(state);
  if (!selection || !datasheet || !selection.activeCell) {
    return;
  }
  const fieldId = selection.activeCell.fieldId;
  return datasheet.snapshot.meta.fieldMap[fieldId];
};

export const getSelectedRecord = (state: IReduxState) => {
  const selection = getSelection(state);
  const datasheet = getDatasheet(state);
  if (!selection || !datasheet || !selection.activeCell) {
    return;
  }
  const recordId = selection.activeCell.recordId;
  return datasheet.snapshot.recordMap[recordId];
};

export const getFillHandleStatus = (state: IReduxState) => {
  const selection = getSelection(state);
  return selection?.fillHandleStatus;
};

/**
 * use for gantt view
 */
export const getGanttLinearRows = createSelectorIgnoreState(
  [state => state, getVisibleRows, getActiveViewGroupInfo],
  (state: IReduxState, visibleRows, groupInfo): ILinearRow[] => {
    return getLinearRowsBase(state, visibleRows, groupInfo);
  });

export const getCurrentGalleryViewStyle = createSelector([getCurrentView], (view: IViewProperty) => {
  if (view.type !== ViewType.Gallery) {
    return;
  }
  return view.style;
});

const getIntegratePermissionWithFieldBase = (
  _state: IReduxState,
  { permission, fieldId, fieldPermissionMap }: { permission: IPermissions; fieldId?: string; fieldPermissionMap?: IFieldPermissionMap },
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

const getIntegratePermissionWithField = createCachedSelector<IReduxState,
  {
    permission: IPermissions;
    datasheetId?: string;
    mirrorId?: string;
    fieldId?: string;
    fieldPermissionMap?: IFieldPermissionMap
  },
  IPermissions,
  IPermissions>(
    getIntegratePermissionWithFieldBase,
    permission => {
      return permission;
    },
  )({
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
  const nodePermission = mirrorId && (datasheet?.id === getActiveDatasheetId(state) || sourceMirrorId) ? getMirror(state, mirrorId)?.permissions :
    datasheet?.permissions;
  const blackSpace = state.billing?.subscription?.blackSpace;

  if (blackSpace) {
    // blacklist space will reset all node's permission to readonly
    return DEFAULT_PERMISSION;
  }

  if (screenWidth && screenWidth < ScreenWidth.md) {
    // smallScreen temporary not allow edit
    // TODO: mobile will support edit in the future
    const permission = datasheet ? getIntegratePermissionWithField(
      state,
      {
        permission: ViewPropertyFilter.getReaderRolePermission(state, datasheet.id, nodePermission)!,
        datasheetId,
        fieldPermissionMap,
        fieldId: fieldId,
        mirrorId,
      },
    ) : {};
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
  if (state.pageParams.shareId || state.pageParams.templateId) {
    return getIntegratePermissionWithField(
      state,
      {
        permission: ViewPropertyFilter.getReaderRolePermission(state, datasheet.id, nodePermission)!,
        datasheetId,
        fieldPermissionMap,
        fieldId: fieldId,
        mirrorId,
      },
    );
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

  return getIntegratePermissionWithField(
    state,
    {
      permission: ViewPropertyFilter.getReaderRolePermission(state, datasheet.id, nodePermission)!,
      datasheetId,
      fieldPermissionMap,
      fieldId: fieldId,
      mirrorId,
    },
  );
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
    const result = filterInfo.conditions.find(
      item => {
        return item.conditionId === conditionId;
      },
    );
    return result && result.value ? result.value : null;
  }
  return null;
};

export const getKanbanGroupMapIds = createSelector([getFieldMap, getKanbanFieldId,
  getFieldPermissionMap], (fieldMap, kanbanFieldId, fieldPermissionMap) => {
  if (!kanbanFieldId) {
    return [];
  }
  const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  if (fieldRole === Role.None) {
    return [];
  }
  const field = fieldMap![kanbanFieldId];
  if (!field) {
    return [];
  }
  if (field.type === FieldType.SingleSelect) {
    return field.property.options.map(item => item.id);
  }
  return (field as IMemberField).property.unitIds;
});

export const getQueryMeta = createSelector(
  [getVisibleColumns, getActiveDatasheetId, getActiveViewFilterInfo, getActiveViewGroupInfo, getActiveViewSortInfo],
  (selectFields, fromDstId, filterInfo, groupInfo, sortInfo) => {
    let q = `select ${selectFields.map(field => field.fieldId).join(',')} from ${fromDstId}\n`;
    if (filterInfo) {
      q += `where ${filterInfo.conditions.map(cond => `${cond.fieldId} ${cond.operator} ${cond.value}`).join(` ${filterInfo.conjunction} `)}\n`;
    }
    if (groupInfo && groupInfo.length) {
      q += `group by ${groupInfo.map(gInfo => gInfo.fieldId).join(',')}\n`;
    }
    if (sortInfo) {
      q += `order by ${sortInfo.rules.map(rule => `${rule.fieldId} ${rule.desc ? 'desc' : ''}`).join(',')}\n`;
    }
    return q;
  },
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

export const getCalendarVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | null | void, ICalendarViewColumn[]>(
  [getCurrentView],
  (view?: ICalendarViewProperty) => {
    return view ? view.columns.filter((item, i) => !(item.hiddenInCalendar && i !== 0)) : [];
  },
)(defaultKeySelector);

export const getOrgChartVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | null | void, IOrgChartViewColumn[]>(
  [getCurrentView],
  (view?: IOrgChartViewProperty) => {
    return view ? view.columns.filter((item: IOrgChartViewColumn, i) => !(item.hiddenInOrgChart && i !== 0)) : [];
  },
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

export const getGanttVisibleColumns = createCachedSelector<IReduxState, string | void, IViewProperty | null | void, IGanttViewColumn[]>(
  [getCurrentView],
  (view?: IGanttViewProperty) => {
    return view ? view.columns.filter((item, _i) => !item.hiddenInGantt) : [];
  },
)(defaultKeySelector);

export const getGanttVisibleColumnCount = (state: IReduxState) => {
  const view = getCurrentView(state);
  if (!view || view.type !== ViewType.Gantt) {
    return -1;
  }
  return getGanttVisibleColumns(state).length;
};

export const getCellValueByGanttDateTimeFieldId = (state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string) => {
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  if (field == null) {
    return null;
  }
  if (Field.bindContext(field, state).basicValueType === BasicValueType.DateTime) {
    return getCellValue(state, snapshot, recordId, field.id);
  }
  if (Field.bindContext(field, state).innerBasicValueType === BasicValueType.DateTime) {
    const cellValue = getCellValue(state, snapshot, recordId, field.id);
    if (cellValue?.length) {
      return cellValue[0];
    }
  }
  return null;
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

export const getFieldRanges = (state: IReduxState) => {
  return getSelection(state)?.fieldRanges;
};

export const getGalleryGroupedRows = createSelectorIgnoreState(
  [state => state, getPureVisibleRows, getSnapshot, getActiveViewGroupInfo],
  (state, records, snapshot, groupInfo) => {
    const groupedRows: string[][] = [];

    if (!groupInfo || !snapshot) {
      return groupedRows;
    }

    if (groupInfo && groupInfo.length === 0) {
      return groupedRows;
    }
    const fieldId = groupInfo[0].fieldId;
    const field = snapshot.meta.fieldMap[fieldId];

    let preRecordId = '';
    let tempGroupedRows: string[] = [];
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const recordId = record.recordId;
      if (index === 0) {
        tempGroupedRows.push(record.recordId);
      } else {
        if (field && Field.bindContext(field, state).compare(
          getCellValue(state, snapshot, preRecordId, fieldId),
          getCellValue(state, snapshot, recordId, fieldId),
        )) {
          groupedRows.push(tempGroupedRows);
          tempGroupedRows = [record.recordId];
        } else {
          tempGroupedRows.push(record.recordId);
        }
      }
      preRecordId = recordId;
      if (index === records.length - 1) {
        groupedRows.push(tempGroupedRows);
        break;
      }
    }
    return groupedRows;
  });

export const getDateTimeCellAlarm = (
  snapshot: IRecordSnapshot,
  recordId: string,
  fieldId: string,
): IRecordAlarm | undefined => {

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
export const getDateTimeCellAlarmForClient = (
  snapshot: IRecordSnapshot,
  recordId: string,
  fieldId: string,
): IRecordAlarmClient | undefined => {
  const alarm = getDateTimeCellAlarm(snapshot, recordId, fieldId);

  if (!alarm) {
    return;
  }

  if (!Array.isArray(alarm.alarmUsers)) {
    return;
  }

  if (alarm.alarmUsers[0].type === AlarmUsersType.Field) {
    const fieldMap = snapshot.meta.fieldMap;
    return {
      ...alarm,
      target: AlarmUsersType.Field,
      alarmUsers: alarm.alarmUsers.map(item => item.data).filter(fieldId => fieldMap[fieldId] && fieldMap[fieldId].type === FieldType.Member)
    };
  }
  return {
    ...alarm,
    target: AlarmUsersType.Member,
    alarmUsers: alarm.alarmUsers.map(item => item.data)
  };
};
