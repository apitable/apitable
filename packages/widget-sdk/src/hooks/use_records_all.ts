import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IWidgetContext } from 'interface';
import { Record } from '../model/record';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';

/**
 * `Beta API`, 未来有可能变更。
 * 
 * 获得表格中所有的 Records。
 * 当记录的值、视图配置、字段配置发生变化的时候，会触发重新渲染。
 * 获取所有的记录可能造计算量急剧上升而产生卡顿，请谨慎使用并做好充分测试。
 *
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useRecordsAll, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 展示记录主键
 * function RecordsTitle() {
 *   const records = useRecordsAll();
 *   return (<div>
 *     {records.map(record => <p>{record.title}</p>)}
 *   </div>);
 * }
 * 
 * // 展示对应 datasheetId(dstXXXXXXXX) 表的记录主键
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
