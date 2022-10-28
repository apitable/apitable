import { Navigation } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { getHistoryMethod, toggleSpace } from 'pc/components/route_manager/helper';
import { IParams, IQuery } from 'pc/components/route_manager/interface';
import { IFunctionResult, RouterStrategy } from 'pc/components/route_manager/router_strategy';

export class Router {
  static push(path: Navigation, info: { params?: IParams, query?: IQuery, clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.Push });
  }

  static redirect(path: Navigation, info: { params?: IParams, query?: IQuery, clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.Redirect });
  }

  static replace(path: Navigation, info: { params?: IParams, query?: IQuery, clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.Replace });
  }

  static newTab(path: Navigation, info: { params?: IParams, query?: IQuery, clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.NewTab });
  }
}

async function navigatePath(path: Navigation, info: { params?: IParams, query?: IQuery, method?: Method, clearQuery?: boolean }) {
  const { params, method } = info;
  const spaceId = params?.spaceId;
  // Will default to new tab open by url jumping
  const go = getHistoryMethod(method);

  await toggleSpace(spaceId);

  const result = RouterStrategy[path](info) as IFunctionResult;
  const pathUrl = result[0];

  if (!pathUrl) {
    return;
  }

  go(pathUrl, result[1], result[2]);
}
