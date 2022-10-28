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
 * import { useSettingsButton } from '@vikadata/widget-sdk';
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
