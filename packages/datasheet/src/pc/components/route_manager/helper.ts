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

import { pick } from 'lodash';
import Router from 'next/router';
import browserPath from 'path-browserify';
import urlcat from 'urlcat';
import { Api, PREVIEW_DATASHEET_ID, StoreActions } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { IOptions, IQuery } from 'pc/components/route_manager/interface';
import { store } from 'pc/store';

export function joinPath(pathParams: (string | undefined)[]) {
  const params: string[] = [];

  for (let i = 0; i < pathParams.length; i++) {
    const param = pathParams[i];
    if (!param) {
      break;
    }
    params.push(param);
  }

  if (params.length === 2) {
    return urlcat(params[0], params[1]);
  }

  return browserPath.join(...params);
}

const wrapper = (cb: (path: string) => void) => (path: string, query?: IQuery, clearQuery?: boolean) => {
  const currentSearch = new URLSearchParams(clearQuery ? '' : window.location.search);

  query &&
    Object.keys(query).forEach((key) => {
      const queryValue = query[key];
      if (queryValue == null) {
        return currentSearch.delete(key);
      }
      if (currentSearch.has(key)) {
        return currentSearch.set(key, queryValue);
      }
      return currentSearch.append(key, queryValue);
    });

  const state = store.getState();

  if (state.datasheetMap[PREVIEW_DATASHEET_ID]) {
    store.dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
  }

  const afterSearch = currentSearch.toString();
  cb(afterSearch ? `${path}?${afterSearch}` : path);
};

/**
 * @return go function, with two arguments that are
 * @params path: The path to jump (without query and hash)
 * @params query: The query carried on the path, e.g. {x: '1', y: '2'} is equivalent to ?x=1&y=2
 */
export const getHistoryMethod = (method?: Method, options?: IOptions) => {
  switch (method) {
    case Method.Push: {
      const pushOptions = pick(options, 'shallow');
      return wrapper((path: string) => Router.push(path, undefined, pushOptions));
    }
    case Method.Replace: {
      return wrapper((path: string) => Router.replace(path));
    }
    case Method.NewTab: {
      return wrapper((path: string) => window.open(path as string, '_blank'));
    }
    case Method.Redirect: {
      return wrapper((path: string) => (window.location.href = path as string));
    }
    default:
  }
  return wrapper((path: string) => Router.push(path));
};

export function getNodeId() {
  const state = store.getState();
  const activeNodeId = state.user.info ? state.user.info.activeViewId : null;
  const treeNodesMap = state.catalogTree.treeNodesMap;
  if (!Object.keys(treeNodesMap).length || !activeNodeId || !treeNodesMap[activeNodeId]) {
    return undefined;
  }
  return treeNodesMap[activeNodeId!].nodeId;
}

// Before switching the space station, you need to update the spaceId in the server session
export const toggleSpace = async (spaceId?: string | null) => {
  if (!spaceId) {
    return;
  }
  const activeSpaceId = store.getState().space.activeId;
  if (activeSpaceId === spaceId) {
    return;
  }

  store.dispatch(StoreActions.setActiveSpaceId(spaceId));

  /**
   * Originally, I wanted to get userInfo information from _app by gettingInitProps to update data,
   * but after testing, in the current version of next (12.3), except for the first page load,
   * _app's props will receive userInfo information and switch the route by router.push.
   * However, in the current version of next (12.3), except for the first load of the page,
   * the props of _app will receive the userInfo information, and the route switch by router.push, the props of _app is undefined,
   * so the userInfo information can't be updated in time, but the information can be updated normally by using router.redirect,
   * so it was decided that when using router.push, if the spaceId parameter is present, it will be manually refreshed
   */
  try {
    const res = await Api.getUserMe({ spaceId });
    const { data, success } = res.data;
    if (success) {
      store.dispatch(StoreActions.setUserMe(data));
    }
  } catch (e) {
    console.warn('getUserMe Error', e);
  }
};
