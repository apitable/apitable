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
