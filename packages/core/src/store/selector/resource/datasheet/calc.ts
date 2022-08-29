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
  IRecordAlarm, IRecordAlarmClient, IRecordSnapshot, IReduxState, ISearchCellResult, ISearchRecordResult, ISearchResult, ISnapshot,
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
 * 由于 Field 类需要依赖根 state 进行计算，我们需要向 selector 中传入根 state，但是又不想破坏 selector 的缓存。
 * 考虑到绝大部分情况下，对根 state 作为 memorize 的参数进行缓存是没有意义的，所以我们这里做了一个假设，
 * 如果使用者传入根 state 作为参数，那么 memoize 函数永远不去检测它的变化。
 */
const createSelectorIgnoreState = createSelectorCreator(defaultMemoize, (pre, next) => {
  // 如果是根 state 作对比，则永远返回 true
  if (isObject(pre) && isObject(next) && ('isStateRoot' in pre) && ('isStateRoot' in next)) {
    return true;
  }
  // 进行普通的引用比较
  return pre === next;
});

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

const defaultKeySelector = (state, datasheetId) => datasheetId || getActiveDatasheetId(state);

const workerCompute = () => (global as any).useWorkerCompute;

export const getDatasheetIds = createDeepEqualSelector(
  (state: IReduxState) => Object.keys(state.datasheetMap),
  keys => keys,
);

// 获取当前活动的视图
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

// 获取当前查找结果列表的一条内容（一个单元格）
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

// 无缓存的计算获取当前可见的列集合
export const getVisibleColumnsBase = (view?: IViewProperty) => {
  return view ? view.columns.filter((item, i) => !(item.hidden && i !== 0)) : [];
};

// 计算获取一列的宽度
export const getColumnWidth = (column: IGridViewColumn) => (!column || column.width == null) ?
  DEFAULT_COLUMN_WIDTH : column.width;

export const getViewById = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.find(view => view.id === viewId);
};

export const getViewIndex = (snapshot: ISnapshot, viewId: string) => {
  return snapshot.meta.views.findIndex(view => view.id === viewId);
};

const filterColumnsByPermission = (columns, fieldPermissionMap) => {
  return columns.filter((column) => {
    // TODO: 列权限第二期删除这里的处理逻辑
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

// 计算单元格值
export const calcCellValue = (
  state: IReduxState,
  snapshot: IRecordSnapshot,
  fieldId: string,
  recordId: string,
  withError?: boolean,
  datasheetId?: string,
  // TODO： 专门为第一期列权限加的字段，下一期删除
  ignoreFieldPermission?: boolean,
) => {
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  // TODO: 字段权限第一期的临时代码，后面需要删掉
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

// 获取单元格值
export const getCellValue = (
  state: IReduxState,
  snapshot: IRecordSnapshot,
  recordId: string,
  fieldId: string,
  withError?: boolean,
  datasheetId?: string,
  ignoreFieldPermission?: boolean,
) => {
  // TODO: 字段权限第一期的临时代码，后面需要删掉
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

export const getTemporaryView = (snapshot: ISnapshot, viewId: string, datasheetId?: string, mirror?: IMirror | null) => {
  const temporaryView = mirror?.temporaryView;

  if (!snapshot) {
    return;
  }

  const originView = getViewById(snapshot, viewId);
  if (!temporaryView || mirror?.sourceInfo.datasheetId !== snapshot.datasheetId) {
    return originView;
  }
  // 在镜像中如果对任意视图配置做了修改，原表的视图配置操作都不会再影响镜像，所以这里直接取用镜像的缓存数据
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
   * 或条件才会有 repeatRows
   * 或条件在 repeatRows 是否存在
   */
  if (repeatRows?.includes(record.id)) {
    return true;
  }
  const { fieldId } = condition;
  const field = snapshot.meta.fieldMap[fieldId];
  // 目前不再对没有权限的列进行数据过滤，因此获取 cellValue 需要避免对权限的检查
  const cellValue = getCellValue(state, snapshot, record.id, fieldId, undefined, undefined, true);
  try {
    return doFilter(state, condition, field, cellValue);
  } catch (error) {
    // FIXME: 计算字段转换引起筛选匹配报错
    console.error(error);
    return false;
  }
};

/**
 * 检查一条 record 是否符合 filterCondition 中的条件
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
   *  isEmpty, isNotEmpty 调用通用逻辑
   */
  if (condition.operator === FOperator.IsEmpty || condition.operator === FOperator.IsNotEmpty) {
    return fieldMethod.isEmptyOrNot(condition.operator, cellValue);
  }

  /**
   *  在非 isEmpty || isNotEmpty 条件下，如果没有填写 value 则不进行筛选
   */
  if (condition.value == null && fieldMethod.basicValueType !== BasicValueType.Number && condition.operator !== FOperator.IsRepeat) {
    return true;
  }

  /**
   * 调用 field 自有的操作符计算函数去计算
   */
  return fieldMethod.isMeetFilter(condition.operator, cellValue, condition.value);
}

export const getFilterInfoExceptInvalid = (state: IReduxState, filterInfo?: IFilterInfo, datasheetId?: string) => {
  // filterInfo.conditions 为空会导致无筛选但不返回数据问题, 这里要过滤
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
      return !(Field.bindContext(field, state).hasError);
    }),
  };
};

const getFilterRowsBase = (state, { filterInfo, rows, snapshot, recordMap }) => {
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

  // 传入的 view 因为经过 mirror 的处理，所以获取的 filterInfo 可能是 mirror 操作的临时数据，所以如果直接从 views 里面读取，无法做到对源表的数据隔离
  const _filterInfo = state?.pageParams?.mirrorId ? snapshot.meta.views.find(item => item.id === view.id)!.filterInfo : view.filterInfo;
  const filterInfo = getFilterInfoExceptInvalid(state, _filterInfo, snapshot.datasheetId);
  const viewRows = getFilterRowsBase(state, { filterInfo, rows, snapshot, recordMap });

  /**
   * getVisibleRowsBase 有时需要处理关联表的数据，如果单纯只以 mirror 的存在做判断会导致数据源是关联表，筛选条件又是本表的错误情况
   * 所以这里需要判断当前提供的 snapshot 和镜像绑定的表是不是一样的
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
 * 筛选出重复的cellValue，返回去重后的rows
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
      // 是否需要排序
      if (isNeedSort) {
        cellValue = sortBy(cellValue as any[], o => typeof o === 'object' ? o.text : o) as ICellValue;
      }
      // 是否需要调用cellValueToString转换成字符串形式
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
      if (Field.bindContext(field, state).hasError) {
        return null;
      }
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

// 非计算字段的值，通过 record.data 和 fieldId 获取。
export const getEntityCellValue = (
  state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string, datasheetId?: string,
) => {
  const recordMap = snapshot.recordMap;
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  // TODO: 如果获取实体字段值时候在，找不到这个 id。证明服务端漏掉了数据。前端需要加上补救措施，主动加载漏掉的字段。
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

// TODO: 列权限第二期，存在数据过滤就不需要在这里进行特殊处理
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
      // 中间层目前没有对无权限的列做数据过滤，所以交给 selector
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
 * 神奇引用删选 record ids
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
  withFilter?: boolean,
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
      // TODO: 线上临时代码，合并到 integration 需要删除这里
      if (!field || acc !== 0) {
        return acc;
      }
      const fieldMethod = Field.bindContext(field, state);
      // 和筛选同理，排序放开对列权限的检查
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
 * @description 处理存在搜索内容时的排序
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
    // kanbanFieldId 设置过权限，且对当前用户不可见，不需要再处理下面的逻辑
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

  // rows 依次按 group 排序
  return rows.sort((row1, row2) => {
    return groups.reduce((prev, field, index) => {
      if (prev !== 0) {
        return prev;
      }
      const res = Field.bindContext(field, state).compare(
        getCellValue(state, snapshot, row1.recordId, field.id),
        getCellValue(state, snapshot, row2.recordId, field.id),
      );
      const sign = descOrders[index] ? -1 : 1;

      return res * sign;
    }, 0) || 1;
  });
};

export const getVisibleRowsBaseComputed = (state: IReduxState, snapshot?: ISnapshot, view?: IViewProperty) => {
  // where 按字段精确匹配
  const filteredRows = getFilteredRows(state, snapshot, view).filter(item => !item.hidden);
  // order by
  const sortedRows = getKeepSortRows(state, view!, snapshot!, filteredRows);
  // group by
  let groupedRows = getSortRowsByGroup(state, view!, snapshot!, sortedRows);
  // 处理看板视图下的搜索排序
  groupedRows = getSortRowsByKanbanGroup(state, view!, snapshot!, groupedRows);

  // 计算激活记录是否位移

  return groupedRows;
};

// 数据层的可视 Rows
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
   * 第一次如果没有读到缓存 则证明是第一次加载产生的计算，这时候加入订阅池
   * 或者 缓存过期，也去重新计算缓存设置
   */
  const visibleRowsBase = cache || getVisibleRowsBaseComputed(state, snapshot, view);
  if (isMirror) {
    visibleRowsBaseCacheManage.setMirror(mirrorId!, snapshot.datasheetId, view.id, visibleRowsBase);
  } else {
    visibleRowsBaseCacheManage.set(snapshot.datasheetId, view.id, visibleRowsBase);
  }
  /**
   * !!! 先过滤再排序，排序性能会好一些。但是为了保证搜索结果的顺序，需要在排序后执行全文搜索。
   * 搜索过程中，会一次性缓存搜索结果，用于上下切换搜索结果。
   */
  // 全局 按文本精确匹配
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
    // 忽略首列为 hidden的 情况
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

// 非冻结列的reselect
export const getExceptFrozenColumns = createSelector(
  [getVisibleColumns, getCurrentView],
  (columns: IGridViewColumn[], view?: IViewProperty) => {
    return (!view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt)) ? [] : columns.slice(view.frozenColumnCount);
  },
);
// 冻结列的reselect
export const getFrozenColumns = createSelector(
  [getVisibleColumns, getCurrentView],
  (columns: IGridViewColumn[], view?: IViewProperty) => {
    return (!view || (view.type !== ViewType.Grid && view.type !== ViewType.Gantt)) ? [] : columns.slice(0, view.frozenColumnCount);
  },
);

// TODO: memory 特别关注
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

// 获取当前激活视图的筛选信息
export const getActiveViewFilterInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  if (!view?.filterInfo) {
    return null;
  }
  return view.filterInfo;
});

// 获取当前激活视图的排序信息
export const getActiveViewSortInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  return view?.sortInfo;
});

// 获取当前激活视图的分组信息
export const getActiveViewGroupInfo = createSelector([getCurrentView], (view: IViewProperty) => {
  if (!view?.groupInfo) {
    return [];
  }
  return view.groupInfo;
});

export const getRecordMoveType = createSelectorIgnoreState(
  [state => state, getPureVisibleRowsIndexMap, getActiveRecordId],
  (state: IReduxState, visibleRowsIndexMap, recordId) => {
    // getPureVisibleRows 获取的是最新的 visibleRows;
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
        // 不存在于当前视图，但是存在 recordMap，表示被过滤
        if (recordId in snapshot.recordMap) {
          return RecordMoveType.OutOfView;
        }
        // 不存在当前视图，也不存在 recordMap，表示被删除。
        return NOT_MOVE;
      }
      if (nextVisibleRowIndex !== positionInfo.visibleRowIndex) {
        return RecordMoveType.WillMove;
      }
    }
    // 提前判断减少不必要的计算
    if (nextVisibleRowIndex === positionInfo.visibleRowIndex) {
      return NOT_MOVE;
    }
    const { recordSnapshot } = activeRowInfo as IActiveUpdateRowInfo;
    const nextRecordSnapshot = getRecordSnapshot(state, recordId);
    // 记录被删除
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
      // 记录是否发生预排序，由 group,filter, 开启了自动排序的 sort fields 决定
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
         * getCellValue 传入的 recordSnapshot 不会对 formula 起作用，formula 始终是最新值。
         * 所以在旧的 recordSnapshot 中存储计算字段的值。用于处理计算字段预排序的情况。
         */
        const field = fieldMap[fieldId];
        let cv1 = recordSnapshot.recordMap[recordId]?.data[fieldId];
        cv1 = handleEmptyCellValue(cv1, Field.bindContext(field, state).basicValueType);
        const cv2 = getCellValue(state, nextRecordSnapshot, recordId, fieldId);
        return !Field.bindContext(field, state).eq(cv1, cv2);
      });
    };
    const isSearching = getIsSearching(state);
    // 非搜索状态下，且指定字段数据变化才引起预排序。
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
      // 记录还存在的时候才插入进去。
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
  // 判断activeCell被移出的情况
  if (selection && selection.activeCell && !(isCellVisible(state, selection.activeCell))) {
    return null;
  }
  // 选区起点和终点被移除
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
 * 从连续或者非连续选区中，获取选中单元格的二维数组。
 * @param state
 */
export const getCellMatrixFromSelection = (state: IReduxState): ICell[][] | null => {
  const selectionRanges = getSelectRanges(state);
  const selectionRecordRanges = getSelectionRecordRanges(state);
  // 非连续选区
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
  // 连续选区
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
  // 考虑到分组的情况，需要知道当前分组是否有足够的空间粘贴数据
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
 * 获得『已经发挥作用了的』筛选条件数量
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

  // TODO 完善逻辑
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
 * 获取选中的记录集，不管是通过 checkbox 选的，还是选区选的。
 * @param state
 */
export const getSelectRecordIds = createSelectorIgnoreState(
  [state => state, getSelectRanges, getSelectionRecordRanges],
  (state, ranges, checkedRecordIds) => {
    const range = ranges[0];
    // 存在选区的情况下，返回选区内的选中记录集。
    if (range) {
      const rangeRecords = getRangeRecords(state, range);
      return rangeRecords ? rangeRecords.map(row => row.recordId) : [];
    }
    // 否则返回勾选中的记录集。
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

export const getCellIndex = (state: IReduxState, cell: ICell) => {
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

function getLinearRowsBase(state: IReduxState, visibleRows, groupInfo, groupingCollapseIds?) {
  const snapshot = getSnapshot(state)!;
  const res: ILinearRow[] = [];
  // init groupBreakpoint
  const groupSketch = new Group(groupInfo);
  const groupLevel = groupInfo.length;
  let preRow: IViewRow = { recordId: '' };
  const lastRow: IViewRow = { recordId: '' };
  const groupingCollapseSet: Map<string, boolean> = new Map(groupingCollapseIds && groupingCollapseIds.map((v) => [v, true]));
  let globalFilterDepth = Infinity;
  // 显示在记录前方的行号，发生分组时重置。
  let displayRowIndex = 0;
  let groupHeadRecordId = '';
  // 存在分组，啥也没有，添加站位行。
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
       *  rec2_1 -> current_record 循环到这里时，groupTabIds 是从上到下现有的分组头 Ids ，不是完整的 groupTabIds。
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
 * 指导 react-window 绘制表格的结构化数据， 层级结构由 depth 反映出来。
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

export const getCellUIIndex = (state: IReduxState, cell: ICell) => {
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
 * 仅供甘特图图形区使用
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
  state: IReduxState,
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
  // 只有是在镜像中打开的数表才需要对权限做覆盖处理，也就是说 url 上的 datasheetId 和需要查询的 datasheetId 保持一致
  const nodePermission = mirrorId && (datasheet?.id === getActiveDatasheetId(state) || sourceMirrorId) ? getMirror(state, mirrorId)?.permissions :
    datasheet?.permissions;
  const blackSpace = state.billing?.subscription?.blackSpace;

  if (blackSpace) {
    // 黑名单空间站把所有节点的权限都重置为只读
    return DEFAULT_PERMISSION;
  }

  if (screenWidth && screenWidth < ScreenWidth.md) {
    // smallScreen 暂时不允许编辑
    // TODO: 移动端逐步支持编辑
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

  // 有时光机回滚预览的时候禁用一切权限
  if (!datasheet || state.datasheetMap[PREVIEW_DATASHEET_ID]) {
    return DEFAULT_PERMISSION;
  }

  // 分享、模板界面，直接返回权限
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
   *  连接还未建立的时候，返回默认禁止编辑的权限。
   * 但这里需要特殊处理，按照 v0.6.2 的架构改版，整个 tab 只存在一个 room，换句话说，只有一个 datasheet 处于 connect 状态，
   * 对于关联表涞水，connect 为 false，所以对于 connect 的检查应该局限于创建 room 的主表，对于关联表的状态不予关心
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
    // 新建的表格没有行高属性，只有添加视图才会在新视图初始。
    return (view as IGridViewProperty).rowHeightLevel || RowHeightLevel.Short;
  }
  return;
};

// 获取 view 实际的行数，不受筛选影响
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
    return view ? view.columns.filter((item, i) => !item.hiddenInGantt) : [];
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
  // 通知中心直接打开卡片没有 snapshot
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
 * 专门提供给前端使用的方法
 * 使用需要注意，这里返回的是个新的数据结构，不可以直接用于 useSelector 里
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
