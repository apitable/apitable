import { useSelector } from 'react-redux';
import { useMeta } from './use_meta';
import { IWidgetState } from 'interface';
import { getWidgetDatasheet, isCurrentDatasheetActive } from '../store/selector';

const getActiveViewId = (state: IWidgetState, currentDatasheetId?: string) => {
  if (!isCurrentDatasheetActive(state, currentDatasheetId)) {
    return;
  }

  return getWidgetDatasheet(state, currentDatasheetId)?.activeView;
};

/**
 * 获得当前激活的视图 ID, 返回一个 string。
 * 当切换视图的时候，会触发重新渲染。
 * 
 * @param
 * 
 * @returns
 *
 * ### 示例
 * ```js
 * import { useActiveViewId, useViewMeta } from '@vikadata/widget-sdk';
 *
 * // 渲染当前选中视图名称
 * function ActiveView() {
 *   const activeViewId = useActiveViewId();
 *   const viewMeta = useViewMeta(activeViewId);
 *   if (!viewMeta) {
 *     return <p>未激活视图</p>
 *   }
 *   return <p>当前激活的视图：{viewMeta.name}</p>
 * }
 * ```
 */
export function useActiveViewId() {
  const { datasheetId } = useMeta();
  return useSelector(state => getActiveViewId(state, datasheetId));
}
