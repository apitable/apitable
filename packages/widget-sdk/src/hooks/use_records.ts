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
import { IRecordQuery, IWidgetContext } from 'interface';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { getSnapshot, getWidgetDatasheet } from 'store';
import { IReduxState, parseInnerFilter, Selectors, validateOpenFilter, ViewFilterDerivate } from '@apitable/core';
import { useReferenceCount } from 'view_computed';
import { DynamicRecord } from 'model/dynamic_record';
import { useGetSignatureAssertFunc } from 'helper/assert_signature_manager';

/**
 * Gets all the records under a given view in the datasheet.
 * Rerendering is triggered when the value of record, view configuration, field configuration changes.
 * Get all the records may cause lag due to a sharp increase in computation, so please use caution and test well.

 * @param viewId The ID for the view, pass undefined to return an empty array.
 * @param query query configuration parameters.
 * @returns
 *
 * ### Example
 * ```js
 * import { useRecords, useActiveViewId } from '@apitable/widget-sdk';
 *
 * // Show record name
 * function RecordsTitle() {
 *   const viewId = useActiveViewId();
 *   const records = useRecords(viewId);
 *   return (<div>
 *     {records.map(record => <p>{record.title}</p>)}
 *   </div>);
 * }
 * ```
 */
export function useRecords(viewId: string | undefined, query?: IRecordQuery): DynamicRecord[];

/**
 *
 * ## Support for loading the corresponding datasheet data records.
 *
 * @param datasheet Datasheet instance, by {@link useDatasheet} get.
 * @param viewId View ID, passing in undefined returns an empty array.
 * @param query query configuration parameters.
 * @returns
 *
 * ### Example
 * ```js
 * import { useRecords, useViewsMeta, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show the primary key of records the corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function RecordsTitle() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewsMeta = useViewsMeta(datasheet);
 *   const records = useRecords(datasheet, viewsMeta[0]?.id);
 *   return (
 *     <div>
 *       {records.map(record => <p>{record.title}</p>)}
 *     </div>
 *  );
 * }
 * ```
 */
export function useRecords(datasheet: Datasheet | undefined, viewId: string | undefined, query?: IRecordQuery): DynamicRecord[];

/**
 * @internal
 */
export function useRecords(param1: Datasheet | string | undefined, param2?: IRecordQuery | string, param3?: IRecordQuery) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const isDatasheet = param1 instanceof Datasheet;
  const viewId = isDatasheet ? (param2 as string) : (param1 as string);
  const query = isDatasheet ? (param3 as IRecordQuery) : (param2 as IRecordQuery);
  const { datasheetId: metaDatasheetId } = useMeta();
  const snapshot = useSelector(getSnapshot);
  const datasheetId = isDatasheet ? (param1 as Datasheet).datasheetId : metaDatasheetId;
  useReferenceCount(datasheetId, viewId);
  const getSignatureUrl = useGetSignatureAssertFunc();
  const visibleRows = useSelector((state) => {
    const snapshot = getWidgetDatasheet(state, datasheetId)?.snapshot;
    if (!datasheetId || !snapshot || !viewId) {
      return null;
    }
    return Selectors.getVisibleRowsWithoutSearch(state as any as IReduxState, datasheetId, viewId);
  });

  return useMemo(() => {
    let _visibleRows = visibleRows;
    if (!datasheetId || !_visibleRows) return [];
    if (query && 'ids' in query) {
      if (!query.ids) {
        return [];
      }
      const idSet = new Set(query.ids);
      _visibleRows = _visibleRows.filter((row) => idSet.has(row.recordId));
    }
    // secondary filter
    if (query?.filter) {
      const { error } = validateOpenFilter(query.filter);
      if (error) {
        throw new Error(`filter query validate error: ${error.message}`);
      }
      const state = context.widgetStore.getState() as any;
      const snapshot = getSnapshot(state, datasheetId)!;
      const filterInfo = parseInnerFilter(query.filter, { state, fieldMap: snapshot.meta.fieldMap }) || undefined;
      const viewFilterDerivate = new ViewFilterDerivate(state, datasheetId);
      _visibleRows = viewFilterDerivate.getFilterRowsBase({ filterInfo, rows: _visibleRows, recordMap: snapshot.recordMap });
    }
    return _visibleRows.map((row) => new DynamicRecord(datasheetId, context, row.recordId, getSignatureUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasheetId, visibleRows, query, context, snapshot]);
}
