import { Navigation } from '@vikadata/core';
import { Method, navigatePath } from 'pc/components/route_manager/use_navigation';
import { store } from 'pc/store';

export const EXPAND_WIDGET = 'EXPAND_WIDGET';

export enum IWidgetFullScreenType {
  Full = '1',
  Normal = '0'
}

export const closeWidgetRoute = (widgetId: string, widgetFullScreen?: IWidgetFullScreenType) => {
  expandWidgetRoute(widgetFullScreen === IWidgetFullScreenType.Normal ? widgetId : '' , true);
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
    navigatePath({
      path: Navigation.SHARE_SPACE,
      params: { nodeId: nodeId, viewId, widgetId, shareId },
      method: isReplace ? Method.Replace : Method.Push,
      query
    });
  } else if (templateId) {
    navigatePath({
      path: Navigation.TEMPLATE,
      params: { nodeId: nodeId, viewId, spaceId, widgetId, categoryId, templateId },
      method: isReplace ? Method.Replace : Method.Push,
      query
    });
  } else {
    navigatePath({
      path: Navigation.WORKBENCH,
      params: { nodeId: nodeId, datasheetId, viewId, spaceId, widgetId },
      method: isReplace ? Method.Replace : Method.Push,
      query
    });
  }
};
