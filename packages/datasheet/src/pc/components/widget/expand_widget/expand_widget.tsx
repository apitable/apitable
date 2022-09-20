import { Navigation } from '@vikadata/core';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';

export const EXPAND_WIDGET = 'EXPAND_WIDGET';

export enum IWidgetFullScreenType {
  Full = '1',
  Normal = '0'
}

export const closeWidgetRoute = (widgetId: string, widgetFullScreen?: IWidgetFullScreenType) => {
  expandWidgetRoute(widgetFullScreen === IWidgetFullScreenType.Normal ? widgetId : '', true);
};

/**
 * 考虑 站内，分享，模板中的使用场景
 * @param widgetId
 */
export const expandWidgetRoute = (widgetId: string, isReplace?: boolean, widgetFullScreen?: IWidgetFullScreenType) => {
  const state = store.getState();
  const spaceId = state.space.activeId;
  const { datasheetId, dashboardId, viewId, shareId, templateId, categoryId, mirrorId } =
    { ...state.pageParams };

  const nodeId = dashboardId || mirrorId || datasheetId;
  const query = { widgetFullScreen };
  if (shareId) {
    const params = { nodeId: nodeId, viewId, widgetId, shareId };
    isReplace ? Router.replace(Navigation.SHARE_SPACE, { params, query }) : Router.push(Navigation.SHARE_SPACE, { params, query });
  } else if (templateId) {
    const params = { nodeId: nodeId, viewId, spaceId, widgetId, categoryId, templateId };
    isReplace ? Router.replace(Navigation.TEMPLATE, { params, query }) : Router.push(Navigation.TEMPLATE, { params, query });
  } else {
    const params = { nodeId: nodeId, datasheetId, viewId, spaceId, widgetId };
    isReplace ? Router.replace(Navigation.WORKBENCH, { params, query }) : Router.push(Navigation.WORKBENCH, { params, query });
  }
};
