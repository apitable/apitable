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

// Method.replace function is not implemented yet
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
    spaceId !== curSpaceId && store.dispatch(StoreActions.setActiveSpaceId(spaceId));
  }
  const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
  const go = getHistoryMethod(method);
  const urlObj = new URL(url);
  const urlQuery = new URLSearchParams(urlObj.search);
  // Since there is a written dead url in the configuration table (starting with vika.cn),
  // for multi-environment testing, it is necessary to open vika.cn
  const reg = new RegExp(`^(${window.location.origin}|(http|https)://vika.cn)|(http|https)://help.vika.cn`);
  let newQuery: IQuery = {};
  // Collect the existing query on the url
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
