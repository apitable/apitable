import { Field } from 'model/field';
import { NO_CACHE } from 'cache_manager/cache';
import { CacheManager } from 'cache_manager';
import { dataSelfHelper } from 'compute_manager/compute_cache_manager';
import { IRecord, IRecordSnapshot, IReduxState, ISnapshot, Role } from 'exports/store/interfaces';
import { evaluate } from 'formula_parser/evaluate';
import { ButtonField } from 'model/field/button_field';
import { handleEmptyCellValue } from 'model/utils';
import { ICellValue } from 'model/record';
import { BasicValueType, FieldType, IAttachmentValue, IFormulaField } from 'types/field_types';
import { getFieldPermissionMap, getFieldRoleByFieldId } from './base';

const workerCompute = () => (global as any).useWorkerCompute;

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

export const calcCellValueAndString = ({
  state,
  snapshot,
  fieldId,
  recordId,
  datasheetId,
  withError,
  ignoreFieldPermission,
}: {
  state: IReduxState;
  snapshot: IRecordSnapshot;
  fieldId: string;
  recordId: string;
  datasheetId?: string;
  withError?: boolean;
  ignoreFieldPermission?: boolean;
}): {
  cellValue: any;
  cellStr: any;
  ignoreCache?: boolean;
} => {
  const cellValue = calcCellValue(state, snapshot, fieldId, recordId, withError, datasheetId, ignoreFieldPermission);
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId]!;
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
    cellStr: field.type === FieldType.URL ? Field.bindContext(field, state).cellValueToTitle(cellValue) : instance.cellValueToString(cellValue),
    // issue: https://github.com/vikadata/vikadata/issues/7757
    ignoreCache: workerCompute() ? false : (field.type === FieldType.CreatedBy ? true : !instance.isComputed),
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
  cacheValue = calcCellValueAndString({ state, snapshot, recordId, fieldId, withError, datasheetId: dsId });

  if (!(cacheValue as any).ignoreCache) {
    CacheManager.setCellCache(dsId, fieldId, recordId, cacheValue);
  }
  return cacheValue.cellStr;
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

  if(field.type === FieldType.Button ) {
    return field.property.text;
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

export const getComputeCellValue = (state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string, withError?: boolean) => {
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
    case FieldType.Button: {
      return (Field.bindContext(field, state) as ButtonField).cellValueToArray(null);
    }
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime: {
      if (!record) {
        return null;
      }
      // @ts-ignore
      return Field.bindContext(field, state).getCellValue(record);
    }
    case FieldType.AutoNumber: {
      if (!record) {
        return null;
      }
      return Field.bindContext(field, state).getCellValue(record, fieldId);
    }
    default:
      return null;
  }
};

export const getFormulaCellValue = (state: IReduxState, field: IFormulaField, record: IRecord, withError?: boolean): ICellValue => {
  return evaluate(field.property.expression, { field, record, state }, withError, false);
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
export const getEntityCellValue = (state: IReduxState, snapshot: IRecordSnapshot, recordId: string, fieldId: string, datasheetId?: string) => {
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
  const recordData = recordMap[recordId] && recordMap[recordId]!.data;
  if (!field || !recordData) {
    return null;
  }
  let cv = recordData[fieldId];
  cv = handleEmptyCellValue(cv, Field.bindContext(field, state).basicValueType);
  return cv;
};

export const _getLookUpTreeValue = (state: IReduxState, snapshot: ISnapshot, recordId: string, fieldId: string, datasheetId?: string) => {
  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[fieldId];
  if (!field) {
    return null;
  }
  if (Field.bindContext(field, state).isComputed) {
    if (field.type === FieldType.LookUp) {
      return Field.bindContext(field, state).getLookUpTreeValue(recordId);
    }
    return getComputeCellValue(state, snapshot, recordId, fieldId);
  }
  return getEntityCellValue(state, snapshot, recordId, fieldId, datasheetId);
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
