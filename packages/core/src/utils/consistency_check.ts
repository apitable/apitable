import xor from 'lodash/xor';
import { ISnapshot } from 'store/interface/resource';

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
 * @param array columns 或者 rows
 * @param key id key
 * @return 待删除的 rows/columns 的 index
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

// 一致性校验，要求 snapshot 中所有 view 不重复，且 rows/columns 与 recordMap/fieldMap 一一对应, 不重复
export function consistencyCheck(snapshot: ISnapshot) {
  const startTime = Date.now();
  const recordsInMap = Object.keys(snapshot.recordMap || {});
  const fieldsInMap = Object.keys(snapshot.meta.fieldMap || {});
  const consistencyErrors: IConsistencyErrorInfo[] = [];
  const duplicateViews = getDuplicates(snapshot.meta.views, 'id');
  // 过滤重复的 view
  const views = duplicateViews ? snapshot.meta.views.filter((_, index) => !duplicateViews.some((idx) => idx === index))
    : snapshot.meta.views;

  // 删除重复的 view
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
        err.notExistInRecordMap = notExistInRecordMap; // 存在于 view.rows 中，但不存在与 recordMap 中，说明 rows 添加了幽灵行
        err.notExistInViewRow = notExistInViewRow; // 存在于 recordMap 中，但是不存在与 view.rows 中，说明 rows 中缺失了行
      }
    }

    if (differentFields.length) {
      const notExistInFieldMap = differentFields.filter(record => !snapshot.meta.fieldMap[record]);
      const notExistInViewColumn = differentFields.filter(record => snapshot.meta.fieldMap[record]);
      err.differentFields = differentFields;
      err.notExistInFieldMap = notExistInFieldMap; // 存在于 view.columns 中，但不存在与 recordMap 中，说明 columns 添加了幽灵行
      err.notExistInViewColumn = notExistInViewColumn; // 存在于 recordMap 中，但是不存在与 view.columns 中，说明 columns 中缺失了行
    }

    consistencyErrors.push(err);
  });

  console.log(`数据校验耗时：${Date.now() - startTime} ms`);
  return consistencyErrors.length ? consistencyErrors : null;
}
