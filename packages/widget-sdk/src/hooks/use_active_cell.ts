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

import { useSelector } from 'react-redux';
import { useMeta } from './use_meta';
import { ICell, IWidgetState } from 'interface';
import { isCurrentDatasheetActive, getSelection } from '../store/selector';

const getActiveCell = (state: IWidgetState, currentDatasheetId?: string) => {
  if (!isCurrentDatasheetActive(state, currentDatasheetId)) {
    return;
  }
  const selection = getSelection(state);
  return selection?.activeCell;
};

/**
 * Get the coordinates of cell where the cursor is currently active, return a {@link ICell}.
 * Rerendering is triggered, When the cursor is moved or the view is switched. 
 *
 * If you need to information not only about the activated cell, but also the selection,
 * please use {@link useSelection}.
 * 
 * @param 
 * 
 * @returns
 *
 * ### Example
 * ```js
 * import { useActiveCell, useRecord } from '@apitable/widget-sdk';
 *
 * // Render the value of currently selected cell
 * function ActiveCell() {
 *   const activeCell = useActiveCell();
 *   const activeRecord = useRecord(activeCell?.recordId);
 *   if (!activeCell || !activeRecord) {
 *     return <p>Cells without activation</p>
 *   }
 *   return <p>Activated Cells: {activeRecord.getCellValueString(activeCell.fieldId)}</p>
 * }
 * ```
 */
export function useActiveCell(): ICell | undefined {
  const { datasheetId } = useMeta();
  return useSelector(state => {
    return getActiveCell(state, datasheetId);
  });
}
