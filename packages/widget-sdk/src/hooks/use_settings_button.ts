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
 * When using this hooks, the settings button will be displayed at the top of the widget window. 
 * Returns the button's activation state, will be re-rendered when setting that is clicked. 
 * You can use toggleSetting actively change the button activation state.
 * The settings screen requires developers to manage the show/hide state themselves via the isShowingSettings state.
 * 
 * @returns
 * 
 * ### Example
 * ```js
 * import { useSettingsButton } from '@apitable/widget-sdk';
 *
 * // Show a widget with  a settings screen
 * function ComponentWithSettings() {
 *   const [isShowingSettings, toggleSettings] = useSettingsButton();
 *   return (<div>
 *     <p>Settings open: {isShowingSettings ? 'yes' : 'no'}</p>
 *     <button onClick={() => toggleSettings()}>Tap me to switch the settings screen</button>
 *     {isShowingSettings && <SettingsComponent>}
 *   </div>);
 * }
 * ```
 */
export function useSettingsButton(): [boolean, (state?: boolean) => void] {
  const { isShowingSettings, toggleSettings } = useContext(WidgetConfigContext);
  return [isShowingSettings, toggleSettings];
}
