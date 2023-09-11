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

export const changeView = (viewId: string) => {
  const state = store.getState();
  const { shareId, datasheetId, templateId, categoryId, mirrorId, recordId, embedId, nodeId } = state.pageParams;
  const spaceId = state.space.activeId;

  window.parent.postMessage(
    {
      message: 'changeView',
      data: {
        nextViewId: viewId,
        roomId: nodeId,
      },
    },
    '*',
  );

  if (shareId) {
    Router.replace(Navigation.SHARE_SPACE, {
      params: {
        shareId,
        nodeId: mirrorId || datasheetId,
        viewId,
        datasheetId,
        recordId,
      },
    });
    return;
  }
  if (embedId) {
    Router.replace(Navigation.EMBED_SPACE, {
      params: {
        embedId,
        nodeId: mirrorId || datasheetId,
        viewId,
        datasheetId,
        recordId,
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
          recordId,
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
          recordId,
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
      recordId,
    },
  });
};
