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
