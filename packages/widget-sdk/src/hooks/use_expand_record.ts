/* eslint-disable @typescript-eslint/naming-convention */
import { IExpandRecord } from 'interface';
import { useCallback, useContext } from 'react';
import { WidgetConfigContext } from '../context';
import { useMeta } from './use_meta';

/**
 * 您可以通过这个方法初始化一个函数，并通过执行函数展开一条 record 记录的弹出框，获得更聚焦的编辑体验。
 * 
 * @returns 指定参数展开一条 record 记录的弹出框的函数。
 * 
 * ### 示例
 * ```js
 * import { useExpandRecord, useRecords } from '@vikadata/widget-sdk';
 *
 * // 展开第一条 record
 * function ExpandFirstRecord() {
 *   const firstRecord = useRecords(view.id)[0];
 *   const expandRecord = useExpandRecord();
 *   return <button onClick={() => expandRecord({recordIds: [firstRecord?.id]})}>展开第一条记录</button>;
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
