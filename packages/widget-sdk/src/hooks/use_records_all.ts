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
    return datasheetItem?.snapshot.meta.views[0].rows;
  });

  return useMemo(() => {
    if (!datasheetId || !rows) return [];

    return rows.map(row => new Record(datasheetId, context, row.recordId));
  }, [datasheetId, rows, context]);
}
