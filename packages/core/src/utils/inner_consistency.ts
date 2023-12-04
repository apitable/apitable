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

import { CollaCommandName } from 'commands/enum';
import { IResourceOpsCollect } from 'command_manager';
import { IJOTAction, OTActionName } from 'engine/ot';
import { IReduxState } from 'exports/store/interfaces';
import { getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import xor from 'lodash/xor';
import { FieldType, ILinkFieldProperty, ILinkIds, ResourceType } from 'types';
import type { ISnapshot } from '../modules/database/store/interfaces/resource';

export type IInnerConsistencyErrorInfo = {
  viewId: string;
  viewName: string;
  recordsInMap: string[];
  notExistInRecordMap?: string[];
  notExistInFieldMap?: string[];
  notExistInViewRow?: string[];
  notExistInViewColumn?: string[];
  duplicateRows?: number[];
  duplicateColumns?: number[];
  replaceRows?: boolean;
} | {
  duplicateViews: number[];
} | {
  /** recordId:fieldId -> updated set of linked recordIds (may be empty) */
  updatedSelfLinkRecordIds: Map<string, string[]>
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
export function checkInnerConsistency(snapshot: ISnapshot) {
  const dstId = snapshot.datasheetId;
  const startTime = Date.now();
  const recordMap = snapshot.recordMap || {};
  const recordsInMap = Object.keys(recordMap);
  const fieldMap = snapshot.meta.fieldMap || {};
  const fieldsInMap = Object.keys(fieldMap);
  const consistencyErrors: IInnerConsistencyErrorInfo[] = [];
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
    const err: IInnerConsistencyErrorInfo = {
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
        err.notExistInRecordMap = notExistInRecordMap; // exists in view.rows, but not in recordMap, indicating that rows add ghost rows
        err.notExistInViewRow = notExistInViewRow; // exists in recordMap, but does not exist in view.rows, indicating that rows are missing in rows
      }
    }

    if (differentFields.length) {
      const notExistInFieldMap = differentFields.filter(record => !snapshot.meta.fieldMap[record]);
      const notExistInViewColumn = differentFields.filter(record => snapshot.meta.fieldMap[record]);
      err.notExistInFieldMap = notExistInFieldMap; // exists in view.columns, but not in fieldMap, indicating that columns have added ghost rows

      // exists in fieldMap, but does not exist in view.columns, indicating that rows are missing in columns
      err.notExistInViewColumn = notExistInViewColumn;
    }

    consistencyErrors.push(err);
  });

  const selfLinkingFieldIds: string[] = [];
  // Find all self-linking link fields
  for (const fieldId in fieldMap) {
    if (fieldMap[fieldId]!.type === FieldType.Link) {
      const prop = fieldMap[fieldId]!.property as ILinkFieldProperty;
      if (prop.foreignDatasheetId === dstId) {
        selfLinkingFieldIds.push(fieldId);
      }
    }
  }

  // Check all self-linking link fields
  if (selfLinkingFieldIds.length) {
    const updatedSelfLinkRecordIds = new Map<string, string[]>();
    for (const fieldId of selfLinkingFieldIds) {
      for (const recordId in recordMap) {
        const record = recordMap[recordId]!;
        const cellValue = record.data[fieldId] as ILinkIds | undefined;
        if (!Array.isArray(cellValue)) {
          continue;
        }
        if (cellValue.some(linkedRecordId => !recordMap[linkedRecordId])) {
          const cellId = recordId + ':' + fieldId;
          updatedSelfLinkRecordIds.set(cellId, cellValue.filter(linkedRecordId => recordMap[linkedRecordId]));
        }
      }
    }
    if (updatedSelfLinkRecordIds.size) {
      consistencyErrors.push({
        updatedSelfLinkRecordIds
      });
    }
  }

  console.log(`dstId:${dstId}, data consistency check done, duration : ${Date.now() - startTime} ms`);
  return consistencyErrors.length ? consistencyErrors : null;
}

export function generateFixInnerConsistencyChangesets(
  datasheetId: string,
  errors: IInnerConsistencyErrorInfo[],
  state: IReduxState,
): IResourceOpsCollect[] {
  const deleteViewActions: IJOTAction[] = [];
  const viewLocalActions: IJOTAction[] = [];
  const datasheet = getDatasheet(state, datasheetId);
  if (!datasheet) {
    return [];
  }

  errors.forEach(data => {
    // Delete duplicate view
    if ('duplicateViews' in data) {
      data.duplicateViews.forEach((index, i) => {
        deleteViewActions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', index - i],
          ld: datasheet.snapshot.meta.views[index],
        });
      });
      return;
    }

    // Remove invalid self-linking record IDs
    if ('updatedSelfLinkRecordIds' in data) {
      const { recordMap } = datasheet.snapshot;
      for (const[cellId, newRecordIds] of data.updatedSelfLinkRecordIds) {
        const [recordId, fieldId] = cellId.split(':') as [string, string];
        const record = recordMap[recordId]!;
        if (!record) {
          continue;
        }
        const oldRecordIds = record.data[fieldId] as ILinkIds;
        if (newRecordIds.length) {
          viewLocalActions.push({
            n: OTActionName.ObjectReplace,
            od: oldRecordIds,
            oi: newRecordIds,
            p: ['recordMap', recordId, 'data', fieldId],
          });
        } else {
          viewLocalActions.push({
            n: OTActionName.ObjectDelete,
            od: oldRecordIds,
            p: ['recordMap', recordId, 'data', fieldId],
          });
        }
      }
      return;
    }

    const {
      viewId,
      notExistInRecordMap,
      notExistInViewRow,
      notExistInFieldMap,
      notExistInViewColumn,
      duplicateRows,
      duplicateColumns,
      replaceRows,
      recordsInMap,
    } = data;
    const viewIndex = datasheet.snapshot.meta.views.findIndex(view => view.id === viewId);
    const rows = datasheet.snapshot.meta.views[viewIndex]!.rows;
    const columns = datasheet.snapshot.meta.views[viewIndex]!.columns;
    // row/column index is value to prevent duplicate deletions
    const rowsToDelete = new Set<number>(duplicateRows);
    const columnsToDelete = new Set<number>(duplicateColumns);

    // column and row may have null values in them, which should be dealt with in advance
    rows.forEach((item, index) => {
      if (!item) {
        rowsToDelete.add(index);
      }
    });
    columns.forEach((item, index) => {
      if (!item) {
        columnsToDelete.add(index);
      }
    });

    // If there are more than 100 rows of data that cannot be matched, the rows of the view are replaced in their entirety
    if (replaceRows) {
      viewLocalActions.push({
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'rows'],
        od: rows,
        oi: recordsInMap.map(recordId => ({ recordId })),
      });
    }

    // If it does not exist in the recordMap, delete it in the view
    notExistInRecordMap &&
      notExistInRecordMap.forEach((recordId: string) => {
        const rowIndex = rows.findIndex(row => row && row.recordId === recordId);
        rowIndex > -1 && rowsToDelete.add(rowIndex);
      });

    // If it does not exist in the view, add it to the view
    notExistInViewRow &&
      notExistInViewRow.forEach((recordId: string) => {
        viewLocalActions.push({
          n: OTActionName.ListInsert,
          p: ['meta', 'views', viewIndex, 'rows', rows.length],
          li: { recordId },
        });
      });

    // If it does not exist in the fieldMap, delete it in the view
    notExistInFieldMap &&
      notExistInFieldMap.forEach((fieldId: string) => {
        const columnIndex = columns.findIndex(column => column && column.fieldId === fieldId);
        columnIndex > -1 && columnsToDelete.add(columnIndex);
      });

    // If it does not exist in the view, add it to the view
    notExistInViewColumn &&
      notExistInViewColumn.forEach((fieldId: string) => {
        viewLocalActions.push({
          n: OTActionName.ListInsert,
          p: ['meta', 'views', viewIndex, 'columns', columns.length],
          li: { fieldId },
        });
      });

    Array.from(rowsToDelete)
      .sort()
      .forEach((index, i) => {
        viewLocalActions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', viewIndex, 'rows', index - i],
          ld: rows[index],
        });
      });
    Array.from(columnsToDelete)
      .sort()
      .forEach((index, i) => {
        viewLocalActions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', viewIndex, 'columns', index - i],
          ld: columns[index],
        });
      });
  });

  const operation = {
    cmd: CollaCommandName.FixConsistency,
    actions: [...viewLocalActions, ...deleteViewActions],
  };

  return [{ resourceId: datasheetId, resourceType: ResourceType.Datasheet, operations: [operation] }];
}