/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { getViewTypeString, IViewProperty } from 'core';
import { IFilterInfo, IGroupInfo, ISortInfo, ViewType } from 'interface/view_types';
import { Datasheet } from 'model';
import { useViews } from './private/use_views';

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
 * Beta API`, possible future changes.
 * 
 * Gets the metadata property of the view.
 * Pass in a viewId, and return undefined when the viewId is illegal or does not exist. 
 * Rerendering is triggered when the metadata property changes.
 * 
 * @param viewId Need to get the view ID of the metadata property
 * @returns
 * 
 * ### Example
 * ```js
 * import { useViewMeta, useActiveViewId } from '@apitable/widget-sdk';
 *
 * // Show name of the currently view.
 * function ViewName() {
 *   const activeViewId = useActiveViewId();
 *   const viewMeta = useViewMeta(activeViewId);
 *   return <p>Current view name: {viewMeta?.name}</p>;
 * }
 * 
 * ```
 * 
 */
export function useViewMeta(viewId: string | undefined): IViewMeta;

/** 
 * ## Support getting the metadata property of the corresponding datasheet view.
 * 
 * @param datasheet Datasheet instance, by {@link useDatasheet} get.
 * @param viewId Need to get the view ID of the metadata property
 * @returns
 * 
 * ### Example
 * ```js
 * import { useViewMeta, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show the current view name of the corresponding datasheetId(dstXXXXXXXX) datasheet.
 * function ViewName() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewMeta = useViewMeta(datasheet, 'viwXXXXXXX');
 *   return <p>Current view name: {viewMeta?.name}</p>;
 * }
 * ```
 * 
 */
export function useViewMeta(datasheet: Datasheet | undefined, viewId: string | undefined): IViewMeta;

export function useViewMeta(param1: Datasheet | string | undefined, param2?: string | undefined) {
  const isDatasheet = param1 instanceof Datasheet;
  const datasheetId = isDatasheet ? (param1 as Datasheet).datasheetId : undefined;
  const viewId = (isDatasheet ? param2 : param1) as string | undefined;
  const viewsData = useViews(datasheetId);
  const view = viewsData.find(view => view.id === viewId);
  if (!view) {
    return undefined;
  }
  return pickViewProperty(view);
}