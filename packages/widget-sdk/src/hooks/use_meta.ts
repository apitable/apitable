import { IMetaType, InstallPosition, IWidgetState, RuntimeEnv } from 'interface';
import { useContext, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getWidgetDatasheet } from 'store';
import { WidgetContext } from '../context';

const getInstallPosition = (state: IWidgetState) => {
  if (state.pageParams?.dashboardId) {
    return InstallPosition.Dashboard;
  }
  if (state.pageParams?.mirrorId || state.pageParams?.datasheetId) {
    return InstallPosition.WidgetPanel;
  } 
  return undefined;
};

/**
 * Get meta information of the widget, including the widget itself, the author, the information in datasheet, etc.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useMeta } from '@apitable/widget-sdk';
 *
 * // Show the datasheet and author associated with the widget
 * function Meta() {
 *   const { datasheetName, authorName } = useMeta();
 *   return (<div>
 *     <p>Name of the datasheet associated with the widget: {datasheetName}</p>
 *     <p>Widget author: {authorName}</p>
 *   </div>);
 * }
 * ```
 *
 */
export function useMeta(): IMetaType {
  const { id, theme, runtimeEnv = RuntimeEnv.Desktop } = useContext(WidgetContext);
  const metaData = useSelector(state => {
    const datasheet = getWidgetDatasheet(state);
    return {
      name: state.widget?.snapshot.widgetName,
      widgetPackageIcon: state.widget?.widgetPackageIcon,
      widgetPackageName: state.widget?.widgetPackageName,
      widgetPackageVersion: state.widget?.widgetPackageVersion,
      // Compatibility audit widget ID, in order to smoothly load the widget code
      widgetPackageId: state.widget?.fatherWidgetPackageId || state.widget?.widgetPackageId,
      authorEmail: state.widget?.authorEmail,
      authorIcon: state.widget?.authorIcon,
      authorLink: state.widget?.authorLink,
      authorName: state.widget?.authorName,
      packageType: state.widget?.packageType,
      releaseType: state.widget?.releaseType,
      releaseCodeBundle: state.widget?.releaseCodeBundle,
      datasheetId: datasheet?.datasheetId,
      datasheetName: datasheet?.datasheetName,
      status: state.widget?.status,
      widgetId: state.widget?.id,
      sourceId: state.widget?.snapshot.sourceId,
      installPosition: getInstallPosition(state),
      spaceId: state.user?.spaceId,
      theme,
      runtimeEnv,
    };
  }, shallowEqual);

  return useMemo(() => {
    return { id, ...metaData };
  }, [id, metaData]);
}
