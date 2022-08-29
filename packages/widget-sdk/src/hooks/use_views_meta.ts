import { useSelector, shallowEqual } from 'react-redux';
import { IWidgetContext, IWidgetState } from 'interface';
import { pickViewProperty } from './use_view_meta';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';
import { useContext } from 'react';
import { WidgetContext } from 'context';
import { useMeta } from 'hooks/use_meta';
import { Selectors } from '@vikadata/core';

/** @internal */
export const viewSelector = (state: IWidgetState, datasheetId?: string) => {
  const datasheet = getWidgetDatasheet(state, datasheetId);
  if (!datasheet) {
    return [];
  }
  return datasheet.snapshot.meta.views;
};

/**
 * `Beta API`, 未来有可能变更。
 *
 * 获取所有视图的 metadata 属性。
 * 当views 顺序变化，或者 metadata 属性变化的时候会触发重新渲染。
 *
 * @returns
 *
 * ### 示例
 * ```js
 * import { useViewsMeta, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 显示所有视图名称
 * function ViewNames() {
 *   const viewsMeta = useViewsMeta();
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>视图名称：{viewMeta.name}</p>)}
 *   </div>);
 * }
 *
 * // 显示对应 datasheetId(dstXXXXXXXX) 表的所有视图名称
 * function DatasheetViewNames() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewsMeta = useViewsMeta(datasheet);
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>视图名称：{viewMeta.name}</p>)}
 *   </div>);
 * }
 * ```
 *
 */
export function useViewsMeta(datasheet?: Datasheet) {
  const viewsData = useSelector(state => viewSelector(state, datasheet?.datasheetId), shallowEqual);
  const context = useContext<IWidgetContext>(WidgetContext);
  const meta = useMeta();
  const state = context.globalStore.getState();
  if (meta.sourceId?.startsWith('mir')) {
    const sourceInfo = Selectors.getMirrorSourceInfo(state, meta.sourceId);
    if (sourceInfo) {
      const viewData = viewsData.find(viewData => viewData.id === sourceInfo.viewId);
      return [pickViewProperty(viewData!)];
    }
  }

  return viewsData.map(viewData => {
    return pickViewProperty(viewData);
  });
}
