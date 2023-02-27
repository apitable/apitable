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

import { useSelector } from 'react-redux';

/**
 * Get the view ID of currently active view, return a value of string.
 * When views switched, re-rendering is triggered.
 * 
 * @param
 * 
 * @returns
 *
 * ### Example
 * ```js
 * import { useActiveViewId, useViewMeta } from '@apitable/widget-sdk';
 *
 * // Render the currently selected view name
 * function ActiveView() {
 *   const activeViewId = useActiveViewId();
 *   const viewMeta = useViewMeta(activeViewId);
 *   if (!viewMeta) {
 *     return <p>Inactive view</p>
 *   }
 *   return <p>Currently active views: {viewMeta.name}</p>
 * }
 * ```
 */
export function useActiveViewId() {
  return useSelector(state => state.pageParams?.viewId);
}
