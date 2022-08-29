import { getViewTypeString, IViewProperty, Selectors } from 'core';
import { IFilterInfo, IGroupInfo, ISortInfo, ViewType } from 'interface/view_types';
import { Datasheet } from 'model';
import { shallowEqual, useSelector } from 'react-redux';
import { getWidgetDatasheet } from 'store';

export interface IViewMeta {
  id: string;
  type: ViewType;
  name: string;
  hidden?: boolean;
  groupInfo?: IGroupInfo;
  filterInfo?: IFilterInfo;
  sortInfo?: ISortInfo;
}

/** @internal */
export const pickViewProperty = (view: IViewProperty): IViewMeta => {
  return {
    id: view.id,
    type: getViewTypeString(view.type) as any as ViewType,
    name: view.name,
    hidden: view.hidden,
    groupInfo: view.groupInfo,
    filterInfo: view.filterInfo as (IFilterInfo | undefined),
    sortInfo: view.sortInfo,
  };
};

/**
 * Beta API`, 未来有可能变更。
 * 
 * 获取视图的 metadata 属性。
 * 传入一个 viewId, 当 viewId 非法或者不存在时，返回 undefined。
 * 当 metadata 属性变化的时候会触发重新渲染。
 * 
 * @param viewId 需要获取 metadata 属性的视图ID
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useViewMeta, useActiveViewId } from '@vikadata/widget-sdk';
 *
 * // 显示当前视图名称
 * function ViewName() {
 *   const activeViewId = useActiveViewId();
 *   const viewMeta = useViewMeta(activeViewId);
 *   return <p>当前视图名称：{viewMeta?.name}</p>;
 * }
 * 
 * ```
 * 
 */
export function useViewMeta(viewId: string | undefined): IViewMeta;

/** 
 * ## 支持获取对应表格视图的 metadata 属性。
 * 
 * @param datasheet Datasheet 实例，通过 {@link useDatasheet} 获取
 * @param viewId 需要获取 metadata 属性的视图ID
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useViewMeta, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 显示对应 datasheetId(dstXXXXXXXX) 表的当前视图名称
 * function ViewName() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewMeta = useViewMeta(datasheet, 'viwXXXXXXX');
 *   return <p>当前视图名称：{viewMeta?.name}</p>;
 * }
 * ```
 * 
 */
export function useViewMeta(datasheet: Datasheet | undefined, viewId: string | undefined): IViewMeta;

export function useViewMeta(param1: Datasheet | string | undefined, param2?: string | undefined) {
  return useSelector(state => {
    const hasDatasheet = param1 instanceof Datasheet;
    const viewId = (hasDatasheet ? param2 : param1) as string | undefined;
    const snapshot = getWidgetDatasheet(state, hasDatasheet ? (param1 as Datasheet).datasheetId : undefined)?.snapshot;
    if (!snapshot) {
      return undefined;
    }

    const view = Selectors.getViewById(snapshot, viewId!);
    if (!view) {
      return undefined;
    }

    return pickViewProperty(view);
  }, shallowEqual);
}
