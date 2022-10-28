/* eslint-disable @typescript-eslint/naming-convention */
import { IExpandRecord } from 'interface';
import { useCallback, useContext } from 'react';
import { WidgetConfigContext } from '../context';
import { useMeta } from './use_meta';

/**
 * you can use this methods to initialize, and get a more focused editing experience by executing the function 
 * to expand a record modal.
 * 
 * @returns A function that expands the modal for a record with the specified parameters.
 * 
 * ### Example
 * ```js
 * import { useExpandRecord, useRecords } from '@vikadata/widget-sdk';
 *
 * // expand first record
 * function ExpandFirstRecord() {
 *   const firstRecord = useRecords(view.id)[0];
 *   const expandRecord = useExpandRecord();
 *   return <button onClick={() => expandRecord({recordIds: [firstRecord?.id]})}>Expand first record</button>;
 * }
 * ```
 * 
 */
export function useExpandRecord(): ((expandRecordParams: IExpandRecord) => void) {
  const { expandRecord } = useContext(WidgetConfigContext);
  const metaDatasheetId = useMeta().datasheetId!;
  return useCallback(({ recordIds, viewId, datasheetId }) => {
    expandRecord({
      viewId,
      recordIds,
      activeRecordId: recordIds[0],
      datasheetId: datasheetId ?? metaDatasheetId,
    });
  }, [metaDatasheetId, expandRecord]);
}
