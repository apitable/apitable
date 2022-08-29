import { shallowEqual, useSelector } from 'react-redux';
import { IWidgetState } from 'interface';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';

const viewSelector = (state: IWidgetState, datasheetId?: string) => {
  const datasheet = getWidgetDatasheet(state, datasheetId);
  if (!datasheet) {
    return [];
  }
  return datasheet.snapshot.meta.views.map(view => view.id);
};

/**
 * 获取当前 datasheet 所有视图的 id。
 * 当视图数量变化的时候，会触发重新渲染。
 * 
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useViewIds, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 显示总视图数量
 * function ViewCount() {
 *   const viewIds = useViewIds();
 *   return <p>当前一共有 {viewIds.length} 个视图</p>;
 * }
 * 
 * // 显示对应 datasheetId(dstXXXXXXXX) 表的总视图数量
 * function DatasheetViewCount() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewIds = useViewIds(datasheet);
 *   return <p>当前一共有 {viewIds.length} 个视图</p>;
 * }
 * ```
 * 
 */
export function useViewIds(datasheet?: Datasheet) {
  return useSelector(state => viewSelector(state, datasheet?.datasheetId), shallowEqual);
}
