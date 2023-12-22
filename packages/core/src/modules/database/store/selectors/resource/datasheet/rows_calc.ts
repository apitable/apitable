import { Strings, t } from 'exports/i18n';

import {
  IFieldPermissionMap, IMirror, IRecord, IReduxState, ISnapshot, IViewDerivation, IViewProperty, IViewRow, Role,
} from 'exports/store/interfaces';

import { Field } from 'model/field';
import { PREVIEW_DATASHEET_ID, RecordMoveType } from 'modules/shared/store/constants';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';

import { FieldType, IField, IFilterInfo, ISortedField } from 'types';
import { getMirror } from '../mirror';

import { getActiveDatasheetId, getActiveViewId, getFieldRoleByFieldId, getSnapshot, getViewById, getViewIdByNodeId } from './base';
import { getCellValue } from './cell_calc';

/**
 * Single Sort Calculation.
 */
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
      const res = fieldMethod.compare(cv1, cv2, true);
      const sign = rule.desc ? -1 : 1;
      return res * sign;
    }, 0);
  });

  return shallowRows;
}

export const getFilterInfo = createCachedSelector<IReduxState,
  string | undefined | void,
  ISnapshot | undefined,
  string | undefined,
  IMirror | undefined | null,
  IFilterInfo | undefined>([getSnapshot, getActiveViewId, state => getMirror(state)], (snapshot, viewId, mirror) => {
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
        return filterInfo;
      }
      return {
        conjunction: filterInfo!.conjunction,
        conditions: mirrorConditions,
      };
    }
    return view.filterInfo;
  })({
    keySelector: (state, datasheetId) => state.pageParams.mirrorId || datasheetId || getActiveDatasheetId(state),
  });

/* clipboard for clipboard */
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
      console.warn('! can\'t find group field %s on datasheet', gp.fieldId);
    }
  });
  return fields;
};

export const getPureVisibleRows = (state: IReduxState, datasheetId?: string) => {
  return getViewDerivation(state, datasheetId).pureVisibleRows;
};

export const getPureVisibleRowsIndexMap = (state: IReduxState, datasheetId?: string) => {
  return getViewDerivation(state, datasheetId).pureVisibleRowsIndexMap;
};

export const findRealField = (state: IReduxState, propsField: IField) => {
  if (propsField.type !== FieldType.LookUp) {
    return propsField;
  }
  return Field.bindContext(propsField, state).getLookUpEntityField();
};

export const EMPTY_DERATION: IViewDerivation = {
  linearRows: [],
  visibleRows: [],
  visibleRowsIndexMap: new Map(),
  pureLinearRows: [],
  linearRowsIndexMap: new Map(),
  rowsWithoutSearch: [],
  rowsIndexMap: new Map(),
  pureVisibleRows: [],
  pureVisibleRowsIndexMap: new Map(),
  kanbanGroupMap: {}
};

export const getViewDerivation = (state: IReduxState, datasheetId?: string, viewId?: string): IViewDerivation => {
  let _datasheetId = datasheetId || getActiveDatasheetId(state)!;
  if (!datasheetId && state.datasheetMap[PREVIEW_DATASHEET_ID]) {
    _datasheetId = PREVIEW_DATASHEET_ID;
  }
  let _viewId = viewId || getActiveViewId(state, _datasheetId)!;
  _viewId = getViewIdByNodeId(state, _datasheetId, _viewId)!;
  const derivation = state.datasheetMap[_datasheetId]?.client?.viewDerivation[_viewId] || EMPTY_DERATION;
  return derivation;
};

export const getViewDerivatePrepared = (state: IReduxState, datasheetId?: string, viewId?: string) => {
  const _datasheetId = datasheetId || getActiveDatasheetId(state)!;
  const _viewId = viewId || getActiveViewId(state)!;
  const nodeViewId = getViewIdByNodeId(state, _datasheetId, _viewId)!;
  return Boolean(state.datasheetMap[_datasheetId]?.client?.viewDerivation[nodeViewId]);
};

export const getRowsIndexMap = (state: IReduxState, datasheetId?: string) => {
  return getViewDerivation(state, datasheetId).rowsIndexMap;
};

export const getRecordMoveType = (state: IReduxState) => {
  return getViewDerivation(state).recordMoveType || RecordMoveType.NotMove;
};

export const getVisibleRowsWithoutSearch = (state: IReduxState, datasheetId?: string, viewId?: string) => {
  return getViewDerivation(state, datasheetId, viewId).rowsWithoutSearch;
};

export const getVisibleRows = (state: IReduxState) => {
  return getViewDerivation(state).visibleRows;
};

export const getVisibleRowsIndexMap = (state: IReduxState) => {
  return getViewDerivation(state).visibleRowsIndexMap;
};

export const getKanbanGroupMap = (state: IReduxState) => {
  return getViewDerivation(state).kanbanGroupMap;
};

export const getKanbanGroup = (kanbanGroupMap: { [groupId: string]: IRecord[] }, groupId: string) => {
  return kanbanGroupMap[groupId] || [];
};

export const getGroupBreakpoint = (state: IReduxState) => {
  return getViewDerivation(state).groupBreakpoint;
};

// Get the search result set
export const getSearchResult = (state: IReduxState) => {
  return getViewDerivation(state).searchResults;
};

/**
 * Instructs the react-window to draw structured data for the table, with the hierarchy reflected by depth.
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
export const getLinearRows = (state: IReduxState) => {
  return getViewDerivation(state).linearRows;
};

export const getLinearRowsIndexMap = (state: IReduxState) => {
  return getViewDerivation(state).linearRowsIndexMap;
};

export const getPureLinearRows = (state: IReduxState) => {
  return getViewDerivation(state).pureLinearRows;
};

export const getVisibleRowIds = createSelector([getVisibleRows], (visibleRows) => {
  return visibleRows.map(row => row.recordId);
});

export const getGalleryGroupedRows = (state: IReduxState) => {
  return getViewDerivation(state).galleryGroupedRows;
};
