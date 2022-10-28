import { useContext, useMemo } from 'react';
import { IWidgetContext } from 'interface';
import { Record } from '../model/record';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { useSelector } from 'react-redux';
import { getWidgetDatasheet } from 'store';

/**
 * Gets information of a specified record.
 * Rerendering is triggered when the value of record, field property changes.
 * 
 * If not ID is passed in, undefined is returned.
 * 
 * @param recordId The ID for this record.
 * @returns
 *
 * ### Example
 * ```js
 * import { useRecord } from '@vikadata/widget-sdk';
 *
 * // Show record title
 * function RecordTitle() {
 *   const record = useRecord('recXXXXXXX');
 *   return <p>{record.title}</p>
 * }
 * ```
 * 
 */
export function useRecord(recordId: string | undefined): Record;

/**
 * ## Support for loading the corresponding datasheet data record.
 * 
 * @param datasheet Datasheet instance, by {@link useDatasheet} get.
 * @param recordId The ID for this record.
 * @returns
 *
 * ### Example
 * ```js
 * import { useRecord, useDatasheet } from '@vikadata/widget-sdk';
 * 
 * // Show the primary key of record the corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function RecordTitle() {
 *   const datasheet = useDatasheet('dstXXXXXXXX);
 *   const record = useRecord('recXXXXXXX');
 *   return <p>{record.title}</p>
 * }
 * ```
 * 
 */
export function useRecord(datasheet: Datasheet, recordId: string | undefined): Record;

export function useRecord(param1: Datasheet | string | undefined, param2?: string | undefined) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const hasDatasheet = param1 instanceof Datasheet;
  const { datasheetId: metaDatasheetId } = useMeta();
  const datasheetId = hasDatasheet ? (param1 as Datasheet).datasheetId : metaDatasheetId;
  const recordId = hasDatasheet ? param2 : (param1 as string | undefined);
  const hasRecord = useSelector(state => {
    if (!datasheetId || !recordId) {
      return false;
    }
    return getWidgetDatasheet(state, datasheetId)?.snapshot.recordMap[recordId];
  });

  return useMemo(() => {
    if (!hasRecord) return;
    return new Record(datasheetId!, context, recordId!);
  }, [datasheetId, recordId, context, hasRecord]);
}
