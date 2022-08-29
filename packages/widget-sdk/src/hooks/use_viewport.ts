import { useContext } from 'react';
import { WidgetConfigContext } from '../context';

/**
 * 返回小程序窗口相关的信息，以及变更函数。
 * 窗口变化的时候，会触发重新渲染。
 * 
 * @returns
 * 
 * ### 示例
 * ```js
 * import { useViewport } from '@vikadata/widget-sdk';
 *
 * // 小程序全屏展示与控制
 * function Viewport() {
 *   const { isFullscreen, toggleFullscreen } = useViewport();
 *   return (<div>
 *     <p>小程序展开全屏: {isFullscreen ? '是' : '否'}</p>
 *     <button onClick={() => toggleFullscreen()}>点我切换小程序展开</button>
 *   </div>);
 * }
 * ```
 * 
 */
export function useViewport(): { isFullscreen: boolean, toggleFullscreen: (state?: boolean) => void } {
  const { isFullscreen, toggleFullscreen } = useContext(WidgetConfigContext);
  return { isFullscreen, toggleFullscreen };
}
