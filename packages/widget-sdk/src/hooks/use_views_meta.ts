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

import { pickViewProperty } from './use_view_meta';
import { Datasheet } from 'model';
import { useViews } from './private/use_views';

/**
 * `Beta API`, possible feature changes.
 *
 * Get the metadata property of the all views.
 * Rerendering is triggered when the order of views changes or the metadata property changes.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useViewsMeta, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show all views name
 * function ViewNames() {
 *   const viewsMeta = useViewsMeta();
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>View names: {viewMeta.name}</p>)}
 *   </div>);
 * }
 *
 * // Show the names of all views corresponding to the datasheetId(dstXXXXXXXX) datasheet 
 * function DatasheetViewNames() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewsMeta = useViewsMeta(datasheet);
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>View names: {viewMeta.name}</p>)}
 *   </div>);
 * }
 * ```
 *
 */
export function useViewsMeta(datasheet?: Datasheet) {
  const viewsData = useViews(datasheet?.datasheetId);
  return viewsData.map(viewData => {
    return pickViewProperty(viewData);
  });
}