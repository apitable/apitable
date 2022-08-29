import { useContext, useMemo } from 'react';
import { IWidgetContext } from 'interface';
import { Record } from '../model/record';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { useSelector } from 'react-redux';
import { getWidgetDatasheet } from 'store';

/**
 * 获取一个指定记录的信息。
 * 当记录的值、字段配置发生变化的时候，会触发重新渲染。
 * 
 * 如果没有传入 ID 会返回 undefined
 * 
 * @param recordId 记录ID
 * @returns
 *
 * ### 示例
 * ```js
 * import { useRecord } from '@vikadata/widget-sdk';
 *
 * // 展示记录主键
 * function RecordTitle() {
 *   const record = useRecord('recXXXXXXX');
 *   return <p>{record.title}</p>
 * }
 * ```
 * 
 */
export function useRecord(recordId: string | undefined): Record;

/**
 * 
 * ## 支持加载对应表格数据 Record
 * 
 * @param datasheet Datasheet 实例，通过 {@link useDatasheet} 获取
 * @param recordId 记录ID
 * @returns
 *
 * ### 示例
 * ```js
 * import { useRecord, useDatasheet } from '@vikadata/widget-sdk';
 * 
 * // 展示对应 datasheetId(dstXXXXXXXX) 表的记录主键
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
