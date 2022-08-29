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
 * 获取小程序的 meta 信息，包含了小程序自身、作者、所在 datasheet 的信息等。
 *
 * @returns
 *
 * ### 示例
 * ```js
 * import { useMeta } from '@vikadata/widget-sdk';
 *
 * // 显示小程序所关联的 datasheet 和作者
 * function Meta() {
 *   const { datasheetName, authorName } = useMeta();
 *   return (<div>
 *     <p>小程序关联的表名称：{datasheetName}</p>
 *     <p>小程序作者：{authorName}</p>
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
      // 兼容审核中小程序ID，为了顺利加载小程序代码
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
