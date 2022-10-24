import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IWidgetContext, IRecordQuery } from 'interface';
import { Record } from '../model/record';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from 'model';
import { getViewById, getVisibleRowsCalcCache, getWidgetDatasheet } from 'store';
import { isIframe } from 'iframe_message/utils';
import { Selectors } from '@apitable/core';

/**
 * 获得表格中一个指定视图下面所有的 Records。
 * 当记录的值、视图配置、字段配置发生变化的时候，会触发重新渲染。
 * 获取所有的 records 可能造计算量急剧上升而产生卡顿，请谨慎使用并做好充分测试。

 * @param viewId 视图 ID, 传入 undefined 则返回空数组
 * @param query 查询配置参数
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useRecords, useActiveViewId } from '@vikadata/widget-sdk';
 *
 * // 展示记录主键
 * function RecordsTitle() {
 *   const viewId = useActiveViewId();
 *   const records = useRecords(viewId);
 *   return (<div>
 *     {records.map(record => <p>{record.title}</p>)}
 *   </div>);
 * }
 * ```
 */
export function useRecords(viewId: string | undefined, query?: IRecordQuery): Record[];

/**
 * 
 * ## 支持加载对应表格数据 Records
 * 
 * @param datasheet Datasheet 实例，通过 {@link useDatasheet} 获取
 * @param viewId 视图 ID, 传入 undefined 则返回空数组
 * @param query 查询配置参数
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useRecords, useViewsMeta, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 展示对应 datasheetId(dstXXXXXXXX) 表的记录主键
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
export function useRecords(datasheet: Datasheet | undefined, viewId: string | undefined, query?: IRecordQuery): Record[];

/**
 * @internal
 */
export function useRecords(param1: Datasheet | string | undefined, param2?: IRecordQuery | string, param3?: IRecordQuery) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const hasDatasheet = param1 instanceof Datasheet;
  const viewId = hasDatasheet ? param2 as string : param1 as string;
  const query = hasDatasheet ? param3 as IRecordQuery : param2 as IRecordQuery;
  const { datasheetId: metaDatasheetId } = useMeta();
  const datasheetId = hasDatasheet ? (param1 as Datasheet).datasheetId : metaDatasheetId;

  const visibleRows = useSelector(state => {
    const snapshot = getWidgetDatasheet(state, datasheetId)?.snapshot;
    if (!datasheetId || !snapshot || !viewId || isIframe()) {
      return null;
    }
    const globalState = context.globalStore.getState();
    const view = getViewById(state, datasheetId, viewId)!;
    return Selectors.getVisibleRowsBase(globalState, snapshot, view);
  });

  const iframeVisibleRows = useSelector(state => {
    const datasheet = getWidgetDatasheet(state, datasheetId);
    if (!datasheetId || !viewId || !isIframe() || datasheet?.isPartOfData) {
      return null;
    }
    return getVisibleRowsCalcCache(state, datasheetId, viewId);
  });

  return useMemo(() => {
    let _visibleRows = isIframe() ? iframeVisibleRows : visibleRows;
    if (!datasheetId || !_visibleRows) return [];
    if (query && 'ids' in query) {
      if (!query.ids) {
        return [];
      }
      const idSet = new Set(query.ids);
      _visibleRows = _visibleRows.filter(row => idSet.has(row.recordId));
    }
    return _visibleRows.map(row => new Record(datasheetId, context, row.recordId));
  }, [datasheetId, visibleRows, iframeVisibleRows, query, context]);
}
