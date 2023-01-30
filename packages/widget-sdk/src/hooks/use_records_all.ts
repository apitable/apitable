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

import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IWidgetContext } from 'interface';
import { Record } from '../model/record';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';

/**
 * `Beta API`, possible future changes.
 * 
 * Get all the records in the datasheet.
 * Rerendering is triggered when the value of record, view configuration, or field configuration changes. 
 * Get all the records may cause lag due to a sharp increase in computation, so please use caution and test well.
 *
 * @returns
 * 
 * ### Example
 * ```js
 * import { useRecordsAll, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show record title
 * function RecordsTitle() {
 *   const records = useRecordsAll();
 *   return (<div>
 *     {records.map(record => <p>{record.title}</p>)}
 *   </div>);
 * }
 * 
 * // Show the primary key of records the corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function DatasheetRecordsTitle() {
 *   const useDatasheet = useDatasheet('dstXXXXXXXX');
 *   const records = useRecordsAll(useDatasheet);
 *   return (<div>
 *     {records.map(record => <p>{record.title}</p>)}
 *   </div>);
 * }
 * ```
 * 
 */
export function useRecordsAll(datasheet?: Datasheet) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const { datasheetId: metaDatasheetId } = useMeta();
  const datasheetId = datasheet ? datasheet.datasheetId : metaDatasheetId;
  const rows = useSelector(state => {
    const datasheetItem = getWidgetDatasheet(state, datasheetId);
    return datasheetItem?.snapshot.meta.views[0]!.rows;
  });

  return useMemo(() => {
    if (!datasheetId || !rows) return [];

    return rows.map(row => new Record(datasheetId, context, row.recordId));
  }, [datasheetId, rows, context]);
}
