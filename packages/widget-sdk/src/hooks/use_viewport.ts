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

import { useContext } from 'react';
import { WidgetConfigContext } from '../context';

/**
 * Return information related to the widget windows, and change function.
 * When windows changes, re-rendering is triggered.
 * 
 * @returns
 * 
 * ### Example
 * ```js
 * import { useViewport } from '@apitable/widget-sdk';
 *
 * // Full-screen display and control of the widget
 * function Viewport() {
 *   const { isFullscreen, toggleFullscreen } = useViewport();
 *   return (<div>
 *     <p>Widget expand full screen: {isFullscreen ? 'yes' : 'no'}</p>
 *     <button onClick={() => toggleFullscreen()}>Tap me to switch the widget to expand</button>
 *   </div>);
 * }
 * ```
 * 
 */
export function useViewport(): { isFullscreen: boolean, toggleFullscreen: (state?: boolean) => void } {
  const { isFullscreen, toggleFullscreen } = useContext(WidgetConfigContext);
  return { isFullscreen, toggleFullscreen };
}
