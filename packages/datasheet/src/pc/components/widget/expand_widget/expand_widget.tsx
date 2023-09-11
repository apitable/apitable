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

import { Navigation } from '@apitable/core';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';

export const EXPAND_WIDGET = 'EXPAND_WIDGET';

export enum IWidgetFullScreenType {
  Full = '1',
  Normal = '0',
}

export const closeWidgetRoute = (widgetId: string, widgetFullScreen?: IWidgetFullScreenType) => {
  expandWidgetRoute(widgetFullScreen === IWidgetFullScreenType.Normal ? widgetId : '', true);
};

/**
 * Consider the use of scenarios in the space, sharing, templates
 * @param widgetId
 */
export const expandWidgetRoute = (widgetId: string, isReplace?: boolean, widgetFullScreen?: IWidgetFullScreenType) => {
  const state = store.getState();
  const spaceId = state.space.activeId;
  const { datasheetId, dashboardId, viewId, shareId, templateId, categoryId, mirrorId, embedId } = { ...state.pageParams };

  const nodeId = dashboardId || mirrorId || datasheetId;
  const query = { widgetFullScreen };
  if (shareId) {
    const params = { nodeId: nodeId, viewId, widgetId, shareId };
    isReplace ? Router.replace(Navigation.SHARE_SPACE, { params, query }) : Router.push(Navigation.SHARE_SPACE, { params, query });
  } else if (templateId) {
    const params = { nodeId: nodeId, viewId, spaceId, widgetId, categoryId, templateId };
    isReplace ? Router.replace(Navigation.TEMPLATE, { params, query }) : Router.push(Navigation.TEMPLATE, { params, query });
  } else if (embedId) {
    const params = { nodeId: nodeId, widgetId, embedId };
    isReplace ? Router.replace(Navigation.EMBED_SPACE, { params, query }) : Router.push(Navigation.EMBED_SPACE, { params, query });
  } else {
    const params = { nodeId: nodeId, datasheetId, viewId, spaceId, widgetId };
    isReplace ? Router.replace(Navigation.WORKBENCH, { params, query }) : Router.push(Navigation.WORKBENCH, { params, query });
  }
};
