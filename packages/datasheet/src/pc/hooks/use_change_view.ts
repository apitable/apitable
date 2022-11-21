import { Navigation } from '@apitable/core';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';

export const changeView = (viewId: string) => {
  const state = store.getState();
  const { shareId, datasheetId, templateId, categoryId, mirrorId, recordId, embedId } = state.pageParams;
  const spaceId = state.space.activeId;
  if (shareId) {
    Router.replace(Navigation.SHARE_SPACE, {
      params: {
        shareId,
        nodeId: mirrorId || datasheetId,
        viewId,
        datasheetId,
        recordId
      },
    });
    return;
  }
  if(embedId) {
    Router.replace(Navigation.EMBED_SPACE, {
      params: {
        embedId,
        nodeId: mirrorId || datasheetId,
        viewId,
        datasheetId,
        recordId
      },
    });
    return;
  }
  if (templateId) {
    if (spaceId) {
      Router.replace(Navigation.TEMPLATE, {
        params: {
          spaceId,
          categoryId,
          templateId,
          nodeId: mirrorId || datasheetId,
          viewId,
          datasheetId,
          recordId
        },
      });
    } else {
      Router.replace(Navigation.TEMPLATE, {
        params: {
          categoryId,
          templateId,
          nodeId: mirrorId || datasheetId,
          viewId,
          datasheetId,
          recordId
        },
      });
    }
    return;
  }
  Router.replace(Navigation.WORKBENCH, {
    params: {
      spaceId,
      nodeId: mirrorId || datasheetId,
      viewId,
      datasheetId,
      recordId
    },
  });
};
