import { Api, ConfigConstant, getCustomConfig, Navigation, PREVIEW_DATASHEET_ID, StoreActions } from '@vikadata/core';
import Router from 'next/router';
import browserPath from 'path-browserify';
import { store } from 'pc/store';
import { dashboardReg, mirrorIdReg } from '../../hooks/use_page_params';

/** 组成路由pathname所需要的属性 */
export interface IParams {
  spaceId?: string | null;
  nodeId?: string;
  viewId?: string;
  recordId?: string;
  shareId?: string;
  categoryId?: string; // 模板分类
  templateId?: string;
  memberId?: string;
  formId?: string;
  pathInSpace?: string;
  feiShuPath?: 'admin_login' | 'bind_space' | 'bind_user' | 'err';
  invitePath?:
    | 'mail/bindphone'
    | 'mail/mismatch'
    | 'mail/invalid'
    | 'link/invalid'
    | 'link/confirm'
    | 'mail/login'
    | 'link/login'
    | 'link'
    | 'mail';
  widgetId?: string;
  dingtalkPath?: 'login' | 'unbound_err' | 'social_login';
  dashboardId?: string;
  datasheetId?: string;
  wecomPath?: 'error' | 'integration' | 'integration/bind_success';
  wecomShopPath?: 'login' | 'unbound_err' | 'social_login';
}

/** 组成query所需要的属性 */
export interface IQuery {
  isMobile?: boolean;
  token?: string;
  inviteMailToken?: string;
  inviteLinkToken?: string;
  loginType?: ConfigConstant.LoginTypes;
  reference?: string; // 用来记录需要源URL
  inputDisabled?: boolean;
  phoneNumber?: string;
  phoneCode?: string;
  nickname?: string;
  quickLogin?: string;
  tenantKey?: string; // 飞书登录用户的企业标识
  openId?: string; // 飞书的用户在应用的唯一标识
  appId?: string; // 飞书
  inviteCode?: string;
  key?: string; // 飞书
  platform?: string; // 表示当前平台，比如（飞书）
  msg?: string;
  domainName?: string; // 专属域名
  suiteId?: string;
  corpId?: string;
  defaultName?: string;
  bizAppId?: string;
  errorCode?: string; // 错误 code
  activeRecordId?: string;
  sourceType?: string; // 来源类型
  widgetFullScreen?: string;
  suiteid?: string;
  auth_code?: string;
  home?: number; // 跳转官网的参数
  spaceId?: string;
  client_id?: string; // 玉符私有化绑定的空间参数
}

export enum Method {
  Push,
  Replace,
  NewTab,
  Redirect,
}

// TODO: 重构这里的代码，有太多重复的地方，可以使用 策略模式 进行路径的组合，简化 if-else 的判断

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

/**
 *
 * @param info url: 用于完整路径的跳转    path：用于跳转到已经指定好的页面
 * @returns
 */
export async function navigatePath(info: { path?: Navigation, params?: IParams, query?: IQuery, method?: Method, clearQuery?: boolean }) {
  const { path, params, method, query, clearQuery } = info;
  const reference = query?.reference;
  const spaceId = params?.spaceId;
  // 将通过url跳转的方式默认为新标签打开
  const go = getHistoryMethod(method);

  await toggleSpace(spaceId);
  switch (path) {
    case Navigation.HOME: {
      store.dispatch(StoreActions.setActiveSpaceId(''));
      if (reference) {
        return navigationToUrl(reference, { method: Method.Redirect, clearQuery: true });
      }
      go('/', query, true);
      return;
    }
    case Navigation.LOGIN: {
      const { redirectUrlOnUnAuthorization } = getCustomConfig();
      if (redirectUrlOnUnAuthorization) {
        location.href = redirectUrlOnUnAuthorization + encodeURIComponent(location.href);
        return;
      }
      go('/login', query, true);
      return;
    }
    case Navigation.APPLY_LOGOUT: {
      go('/user/apply_logout', query, true);
      return;
    }
    case Navigation.CREATE_SPACE: {
      go('/user/create_space');
      return;
    }
    case Navigation.SETTING_NICKNAME: {
      go('/user/set_nickname', query, true);
      return;
    }
    case Navigation.IMPROVING_INFO: {
      go('/user/improving_info', query, true);
      return;
    }
    case Navigation.INVITATION_VALIDATION: {
      go('/user/invitation_validation', query);
      return;
    }
    case Navigation.RESET_PWD: {
      go('/user/reset_password');
      return;
    }
    case Navigation.FEISHU: {
      if (!params?.feiShuPath) {
        return;
      }
      go(`/user/feishu/${params!.feiShuPath}`, query, true);
      return;
    }
    case Navigation.DINGTALK: {
      if (!params?.dingtalkPath) {
        go('/user/dingtalk_callback', query, clearQuery);
        return;
      }
      go(`/user/dingtalk/${params!.dingtalkPath}`, query, clearQuery);
      return;
    }
    case Navigation.WECOM: {
      if (!params?.wecomPath) {
        return;
      }
      go(`/user/wecom/${params!.wecomPath}`, query, clearQuery);
      return;
    }
    case Navigation.INVITE: {
      if (!params!.invitePath) {
        return;
      }
      go(`/invite/${params!.invitePath}`, query, true);
      return;
    }
    case Navigation.WECOM_SHOP_CALLBACK: {
      go('/user/wecom_shop/callback', query, clearQuery);
      return;
    }
    case Navigation.SPACE: {
      go('/workbench', undefined, clearQuery);
      return;
    }
    case Navigation.TRASH: {
      go('/workbench/trash');
      return;
    }
    case Navigation.WORKBENCH: {
      if (reference) {
        return navigationToUrl(reference, { method: Method.Redirect, clearQuery: true });
      }

      if (!params) {
        go('/workbench', query, clearQuery);
        return;
      }

      const nodeId = params.nodeId || params.formId;
      let path: string;
      const defaultNodeId = getNodeId();
      const commonParams = ['/workbench', nodeId || defaultNodeId];

      if (dashboardReg.test(`/${nodeId}`)) {
        path = joinPath([...commonParams, params!.widgetId]);
      } else if (mirrorIdReg.test(`/${nodeId}`)) {
        path = joinPath([
          ...commonParams,
          params.datasheetId,
          params.viewId,
          params.recordId || params.widgetId,
        ]);
      } else {
        path = joinPath([
          ...commonParams,
          params.viewId,
          params.recordId || params.widgetId,
        ]);
      }

      go(path, query, clearQuery);
      return;
    }
    case Navigation.SPACE_MANAGE: {
      const path = joinPath(['/management', params!.pathInSpace]);
      go(path);
      return;
    }
    case Navigation.TEMPLATE: {
      let path;
      const commonParams = [
        '/template',
        params?.categoryId,
        params?.templateId,
        params?.nodeId,
      ];
      if (dashboardReg.test(`/${params?.nodeId}`)) {
        path = joinPath([
          ...commonParams,
          params?.widgetId,
        ]);
      } else if (mirrorIdReg.test(`/${params?.nodeId}`)) {
        path = joinPath([
          ...commonParams,
          params!.datasheetId,
          params!.viewId,
          params!.recordId,
        ]);
      } else {
        path = joinPath([
          ...commonParams,
          params?.viewId,
          params?.recordId || params?.widgetId,
        ]);
      }
      go(path, query, clearQuery);
      return;
    }
    case Navigation.NOT_FOUND: {
      go('/404');
      return;
    }
    case Navigation.SHARE_FAIL: {
      go('/share/fail');
      return;
    }
    case Navigation.SHARE_SPACE: {
      let path;
      const commonParams = [
        '/share',
        params?.shareId,
        params?.nodeId,
      ];
      if (dashboardReg.test(`/${params?.nodeId}`)) {
        path = joinPath([
          ...commonParams,
          params!.widgetId,
        ]);
      } else if (mirrorIdReg.test(`/${params?.nodeId}`)) {
        path = joinPath([
          ...commonParams,
          params!.datasheetId,
          params!.viewId,
          params!.recordId,
        ]);
      } else {
        path = joinPath([
          ...commonParams,
          params?.viewId,
          params?.recordId || params?.widgetId,
        ]);
      }

      go(path, query, clearQuery);
      return;
    }
    case Navigation.MEMBER_DETAIL: {
      go(`/org/${params?.memberId}`);
      return;
    }
    default:
      go('/404');
  }
}

/**
 * @return go 函数，拥有两个参数分别是
 *  @params path: 跳转的路径（不带 query 和 hash)
 *  @params query: 路径上携带的 query，例：{x: '1', y: '2'} 则等于 ?x=1&y=2
 */
const getHistoryMethod = (method?: Method) => {
  const wrapper = (cb: (path: string) => void) => (
    path: string,
    query?: IQuery,
    clearQuery?: boolean,
  ) => {
    const currentSearch = new URLSearchParams(
      clearQuery ? '' : window.location.search,
    );
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

export const useNavigation = () => {
  return navigatePath;
};

// 暂时没有实现Method.replace功能
export const navigationToUrl = (
  url: string,
  option: {
    clearQuery?: boolean;
    method?: Method;
    spaceId?: string;
    query?: IQuery;
    hash?: string;
  } = { clearQuery: false, method: Method.NewTab },
) => {
  const { clearQuery, method, spaceId, query, hash = '' } = option;
  if (spaceId) {
    const curSpaceId = store.getState().space.activeId;
    spaceId !== curSpaceId &&
    store.dispatch(StoreActions.setActiveSpaceId(spaceId));
  }
  const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
  const go = getHistoryMethod(method);
  const urlObj = new URL(url);
  const urlQuery = new URLSearchParams(urlObj.search);
  // 由于配置表中有写死的url(vika.cn开头)，为了多环境测试，需要开放vika.cn
  const reg = new RegExp(`^(${window.location.origin}|(http|https)://vika.cn)`);
  let newQuery: IQuery = {};
  // 收集url上已有的query
  for (const [key, value] of urlQuery) {
    newQuery[key] = value;
  }
  if (isFeishu && reg.test(url)) {
    newQuery = { ...newQuery, platform: 'feishu' };
  }
  const tempUrl = `${urlObj.origin}${urlObj.pathname}${hash}`;
  if (method === Method.Push) {
    window.open(`${tempUrl}?${new URLSearchParams({ ...newQuery, ...query } as Record<string, string>)}`, '_self');
    return;
  }
  go(tempUrl, { ...newQuery, ...query }, clearQuery);
};

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

function getNodeId() {
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
