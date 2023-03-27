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

import { Datasheet } from 'model';
import { useViews } from './private/use_views';

/**
 * Gets the ID of all view of the currently datasheet.
 * Rerendering is triggered when the number of views changes.
 * 
 * @returns
 * 
 * ### Example
 * ```js
 * import { useViewIds, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Display the total number of views 
 * function ViewCount() {
 *   const viewIds = useViewIds();
 *   return <p>There are currently {viewIds.length} views</p>;
 * }
 * // Displays the total number of views corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function DatasheetViewCount() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewIds = useViewIds(datasheet);
 *   return <p>There are currently {viewIds.length} views</p>;
 * }
 * ```
 * 
 */
export function useViewIds(datasheet?: Datasheet) {
  const viewsData = useViews(datasheet?.datasheetId);
  return viewsData.map(view => view.id);
}
