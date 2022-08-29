import { navigatePath, Method } from 'pc/components/route_manager/use_navigation';
import { Navigation } from '@vikadata/core';
import { store } from 'pc/store';

export const changeView = (viewId: string) => {
  const state = store.getState();
  const { shareId, datasheetId, templateId, categoryId, mirrorId } = state.pageParams;
  const spaceId = state.space.activeId;
  if (shareId) {
    navigatePath({
      path: Navigation.SHARE_SPACE, params: {
        shareId,
        nodeId: mirrorId || datasheetId,
        viewId,
        datasheetId
      },
      method: Method.Replace,
    });
    return;
  }
  if (templateId) {
    if (spaceId) {
      navigatePath({
        path: Navigation.TEMPLATE,
        params: {
          spaceId,
          categoryId,
          templateId,
          nodeId: mirrorId || datasheetId,
          viewId,
          datasheetId
        },
        method: Method.Replace,
      });
    } else {
      navigatePath({
        path: Navigation.TEMPLATE,
        params: {
          categoryId,
          templateId,
          nodeId: mirrorId || datasheetId,
          viewId,
          datasheetId
        },
        method: Method.Replace,
      });
    }
    return;
  }
  navigatePath({
    path: Navigation.WORKBENCH,
    params: {
      spaceId,
      nodeId: mirrorId || datasheetId,
      viewId,
      datasheetId
    },
    method: Method.Replace,
  });
};
