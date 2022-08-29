import { useContext } from 'react';
import { WidgetConfigContext } from '../context';

/**
 * 当使用这个 hooks 时候，小程序窗口顶部会显示设置按钮。
 * 返回按钮的激活状态，当设置那被点击的时候，会重新渲染。你可以使用 toggleSetting 来主动改变按钮激活状态。
 * 设置界面需要开发者通过 isShowingSettings 状态来自行管理显示/隐藏状态。
 * 
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useSettingsButton } from '@vikadata/widget-sdk';
 *
 * // 显示一个带设置界面的小程序
 * function ComponentWithSettings() {
 *   const [isShowingSettings, toggleSettings] = useSettingsButton();
 *   return (<div>
 *     <p>设置打开: {isShowingSettings ? '是' : '否'}</p>
 *     <button onClick={() => toggleSettings()}>点我切换设置界面</button>
 *     {isShowingSettings && <SettingsComponent>}
 *   </div>);
 * }
 * ```
 */
export function useSettingsButton(): [boolean, (state?: boolean) => void] {
  const { isShowingSettings, toggleSettings } = useContext(WidgetConfigContext);
  return [isShowingSettings, toggleSettings];
}
