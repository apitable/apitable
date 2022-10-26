// 暂时没有实现Method.replace功能
import { StoreActions } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { getHistoryMethod } from 'pc/components/route_manager/helper';
import { IQuery } from 'pc/components/route_manager/interface';
import { store } from 'pc/store';

export const navigationToUrl = (
  url: string | undefined,
  option: {
    clearQuery?: boolean;
    method?: Method;
    spaceId?: string;
    query?: IQuery;
    hash?: string;
  } = { clearQuery: false, method: Method.NewTab },
) => {
  if (!url) return;
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
  const reg = new RegExp(`^(${window.location.origin}|(http|https)://vika.cn)|(http|https)://help.vika.cn`);
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
