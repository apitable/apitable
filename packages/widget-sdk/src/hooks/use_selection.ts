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

import { shallowEqual, useSelector } from 'react-redux';
import { useMeta } from './use_meta';
import { IWidgetState } from 'interface';
import { isCurrentDatasheetActive, getSelection, getVisibleColumns } from '../store/selector';
import { useRecords } from './use_records';
import { useActiveViewId } from './use_active_view_id';
import { Record } from '../model';
import { Selectors, WhyRecordMoveType } from 'core';
import { IReduxState } from '@apitable/core';

const getSelectedFieldIds = (state: IWidgetState, currentDatasheetId?: string, viewId?: string, records?: Record[]) => {
  if (!isCurrentDatasheetActive(state, currentDatasheetId)) {
    return;
  }

  const selection = getSelection(state);

  if (!selection || !currentDatasheetId || !viewId || !records) {
    return;
  }

  const { ranges, recordRanges } = selection;
  
  const visibleColumns = getVisibleColumns(state, currentDatasheetId, viewId);
  
  const visibleRowsIndexMap = Selectors.getVisibleRowsIndexMapBase(records?.map(record => ({ recordId: record.id })));
  // continuous selection
  if (recordRanges) {
    return {
      recordIds: recordRanges.filter(recordId => visibleRowsIndexMap.has(recordId)),
      fieldIds: visibleColumns.map(column => column.fieldId),
    };
  }

  if (!ranges?.length) {
    return;
  }

  const { fieldId: startFieldId, recordId: startRecordId } = ranges[0]!.start;
  const { fieldId: endFieldId, recordId: endRecordId } = ranges[0]!.end;

  // handle pre-order
  const activeRowInfo = Selectors.getActiveRowInfo(state as any as IReduxState, currentDatasheetId);
  const { recordId: activeRecordId, visibleRowIndex } = activeRowInfo?.positionInfo || {} as any;
  const visibleRecordIds = records?.map(record => record.id);
  if (visibleRowIndex >= 0 && records[visibleRowIndex]?.id !== activeRecordId && activeRowInfo?.type === WhyRecordMoveType.UpdateRecord) {
    visibleRecordIds.splice(visibleRowIndex, 0, activeRecordId);
  }

  if (visibleRowIndex >= 0 && activeRowInfo?.type === WhyRecordMoveType.NewRecord) {
    const index = visibleRecordIds.findIndex(recordId => recordId === activeRecordId);
    index > -1 && visibleRecordIds.splice(index, 1);
    visibleRecordIds.splice(visibleRowIndex, 0, activeRecordId);
  }

  const visiblePureRowsIndexMap = new Map(visibleRecordIds?.map((item, index) => [item, index]));

  // field
  const visibleColumnsIndexMap = new Map(visibleColumns?.map((item, index) => [item.fieldId, index]));
  // if the boundary in the range is not in the visible area, the selection returns undefined
  if (
    !visiblePureRowsIndexMap.has(startRecordId) ||
    !visiblePureRowsIndexMap.has(endRecordId) ||
    !visibleColumnsIndexMap.has(startFieldId) ||
    !visibleColumnsIndexMap.has(endFieldId)) {
    return;
  }
  const startCellIndex = {
    recordIndex: visiblePureRowsIndexMap.get(startRecordId)!,
    fieldIdIndex: visibleColumnsIndexMap.get(startFieldId)!
  };
  const endCellIndex = {
    recordIndex: visiblePureRowsIndexMap.get(endRecordId)!,
    fieldIdIndex: visibleColumnsIndexMap.get(endFieldId)!
  };

  const startRecordIndex = Math.min(startCellIndex.recordIndex, endCellIndex.recordIndex);
  const endRecordIndex = Math.max(startCellIndex.recordIndex, endCellIndex.recordIndex);
  const startFieldIndex = Math.min(startCellIndex.fieldIdIndex, endCellIndex.fieldIdIndex);
  const endFieldIndex = Math.max(startCellIndex.fieldIdIndex, endCellIndex.fieldIdIndex);

  return {
    fieldIds: visibleColumns.slice(startFieldIndex, endFieldIndex + 1).map(column => column.fieldId),
    recordIds: visibleRecordIds.slice(startRecordIndex, endRecordIndex + 1)
  };
};

/**
 * Get the recordId and fieldId of the region selected by the current cell cursor. 
 * Rerendering is triggered when the cursor is moved or the view is switched.
 *
 * If you only need information about the active cell, please use {@link useActiveCell}.
 *
 * @returns
 * 
 * ### Example
 * ```js
 * import { useSelection, useRecords, useFields, useActiveViewId } from '@apitable/widget-sdk';
 *
 * // Render the currently selection information
 * function Selection() {
 *   const selection = useSelection();
 *   const viewId = useActiveViewId();
 *   const records = useRecords(viewId, { ids: selection?.recordIds });
 *   const fields = useFields(viewId, { ids: selection?.fieldIds });
 *
 *   return (<table>
 *     <thead>
 *       <tr>
 *         {fields.map(field => <th key={field.id}>{field.name || '_'}</th>)}
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {records.map(record =>
 *         <tr key={record.id}>
 *           {fields.map(field =>
 *             <td key={field.id}>{record.getCellValueString(field.id) || '_'}</td>
 *           )}
 *        </tr>
 *       )}
 *     </tbody>
 *   </table>);
 * }
 * ```
 * 
 */
export function useSelection() {
  const { datasheetId } = useMeta();
  const activeViewId = useActiveViewId();
  const records = useRecords(activeViewId);

  return useSelector(state => {
    return getSelectedFieldIds(state, datasheetId, activeViewId, records);
  }, shallowEqual);
}
