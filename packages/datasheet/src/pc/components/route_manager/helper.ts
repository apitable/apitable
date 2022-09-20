import { Api, PREVIEW_DATASHEET_ID, StoreActions } from '@vikadata/core';
import Router from 'next/router';
import { Method } from 'pc/components/route_manager/const';
import { IQuery } from 'pc/components/route_manager/interface';
import { store } from 'pc/store';
import browserPath from 'path-browserify';

export function joinPath(pathParams: (string | undefined)[]) {
  const params: string[] = [];

  for (let i = 0; i < pathParams.length; i++) {
    const param = pathParams[i];
    if (!param) {
      break;
    }
    params.push(param);
  }

  return browserPath.join(...params);
}

const wrapper = (cb: (path: string) => void) => (path: string, query?: IQuery, clearQuery?: boolean,) => {
  const currentSearch = new URLSearchParams(
    clearQuery ? '' : window.location.search,
  );

  query && Object.keys(query).forEach((key) => {
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
 * @return go 函数，拥有两个参数分别是
 *  @params path: 跳转的路径（不带 query 和 hash)
 *  @params query: 路径上携带的 query，例：{x: '1', y: '2'} 则等于 ?x=1&y=2
 */
export const getHistoryMethod = (method?: Method) => {
  switch (method) {
    case Method.Push: {
      return wrapper((path: string) => Router.push(path));
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
  if (
    !Object.keys(treeNodesMap).length ||
    !activeNodeId ||
    !treeNodesMap[activeNodeId]
  ) {
    return undefined;
  }
  return treeNodesMap[activeNodeId!].nodeId;
}

// 切换空间站之前，需要更新服务端 Session 中的 spaceId
export const toggleSpace = async(spaceId?: string | null) => {
  if (!spaceId) {
    return;
  }
  const activeSpaceId = store.getState().space.activeId;
  if (activeSpaceId === spaceId) {
    return;
  }

  store.dispatch(StoreActions.setActiveSpaceId(spaceId));

  try {
    await Api.getUserMe({ spaceId });
  } catch (e) {
    console.warn('getUserMe Error', e);
  }
};
