import xor from 'lodash/xor';
import { ISnapshot } from '../modules/database/store/interfaces/resource';

export type IConsistencyErrorInfo = {
  viewId: string;
  viewName: string;
  recordsInMap: string[];
  differentRecords?: string[];
  notExistInRecordMap?: string[];
  notExistInFieldMap?: string[];
  notExistInViewRow?: string[];
  notExistInViewColumn?: string[];
  differentFields?: string[];
  duplicateRows?: number[];
  duplicateColumns?: number[];
  replaceRows?: boolean;
} | {
  duplicateViews: number[];
};

/**
  *
  * @param array columns or rows
  * @param key id key
  * @return the index of the rows/columns to be deleted
  */
function getDuplicates<T = any>(array: T[], key: 'recordId' | 'fieldId' | 'id'): number[] | null {
  const set = new Set();
  const result: number[] = [];
  array.forEach((item, index) => {
    if (!item) {
      result.push(index);
      return;
    }
    const str = item[key];
    set.has(str) ? result.push(index) : set.add(str);
  });
  return result.length ? result.sort() : null;
}

// Consistency check requires that all views in the snapshot are not duplicated, 
// and that rows/columns correspond to recordMap/fieldMap one-to-one without duplication
export function consistencyCheck(snapshot: ISnapshot) {
  const startTime = Date.now();
  const recordsInMap = Object.keys(snapshot.recordMap || {});
  const fieldsInMap = Object.keys(snapshot.meta.fieldMap || {});
  const consistencyErrors: IConsistencyErrorInfo[] = [];
  const duplicateViews = getDuplicates(snapshot.meta.views, 'id');
  // filter duplicate views
  const views = duplicateViews ? snapshot.meta.views.filter((_, index) => !duplicateViews.some((idx) => idx === index))
    : snapshot.meta.views;

  // remove duplicate views
  if (duplicateViews) {
    consistencyErrors.push({
      duplicateViews,
    });
  }

  views.forEach(view => {
    const recordsInRow = view.rows.filter(row => Boolean(row && row.recordId)).map(row => row.recordId);
    const fieldsInColumn = (view.columns as any[]).filter(column => Boolean(column && column.fieldId)).map(column => column.fieldId);
    const differentRecords = xor(recordsInMap, recordsInRow);
    const differentFields = xor(fieldsInMap, fieldsInColumn);
    const duplicateRows = getDuplicates(view.rows, 'recordId');
    const duplicateColumns = getDuplicates(view.columns, 'fieldId');
    const err: IConsistencyErrorInfo = {
      viewId: view.id,
      viewName: view.name,
      recordsInMap,
    };
    if (!differentRecords.length && !differentFields.length && !duplicateRows && !duplicateColumns) {
      return;
    }

    duplicateRows && (err.duplicateRows = duplicateRows);
    duplicateColumns && (err.duplicateColumns = duplicateColumns);

    if (differentRecords.length) {
      if (differentRecords.length > 100) {
        err.replaceRows = true;
      } else {
        const notExistInRecordMap = differentRecords.filter(record => !snapshot.recordMap[record]);
        const notExistInViewRow = differentRecords.filter(record => snapshot.recordMap[record]);
        err.differentRecords = differentRecords;
        err.notExistInRecordMap = notExistInRecordMap; // exists in view.rows, but not in recordMap, indicating that rows add ghost rows
        err.notExistInViewRow = notExistInViewRow; // exists in recordMap, but does not exist in view.rows, indicating that rows are missing in rows
      }
    }

    if (differentFields.length) {
      const notExistInFieldMap = differentFields.filter(record => !snapshot.meta.fieldMap[record]);
      const notExistInViewColumn = differentFields.filter(record => snapshot.meta.fieldMap[record]);
      err.differentFields = differentFields;
      err.notExistInFieldMap = notExistInFieldMap; // exists in view.columns, but not in recordMap, indicating that columns have added ghost rows

      // exists in recordMap, but does not exist in view.columns, indicating that rows are missing in columns
      err.notExistInViewColumn = notExistInViewColumn; 
    }

    consistencyErrors.push(err);
  });

  console.log(`Data verification time: ${Date.now() - startTime} ms`);
  return consistencyErrors.length ? consistencyErrors : null;
}
