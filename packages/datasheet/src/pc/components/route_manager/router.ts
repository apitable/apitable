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
import { Method } from 'pc/components/route_manager/const';
import { getHistoryMethod, toggleSpace } from 'pc/components/route_manager/helper';
import { IParams, IQuery, IOptions } from 'pc/components/route_manager/interface';
import { IFunctionResult, RouterStrategy } from 'pc/components/route_manager/router_strategy';

export class Router {
  static push(path: Navigation, info: { params?: IParams; query?: IQuery; clearQuery?: boolean; options?: IOptions } = {}) {
    navigatePath(path, { ...info, method: Method.Push });
  }

  static redirect(path: Navigation, info: { params?: IParams; query?: IQuery; clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.Redirect });
  }

  static replace(path: Navigation, info: { params?: IParams; query?: IQuery; clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.Replace });
  }

  static newTab(path: Navigation, info: { params?: IParams; query?: IQuery; clearQuery?: boolean } = {}) {
    navigatePath(path, { ...info, method: Method.NewTab });
  }
}

async function navigatePath(path: Navigation, info: { params?: IParams; query?: IQuery; method?: Method; clearQuery?: boolean; options?: IOptions }) {
  const { params, method, options } = info;
  const spaceId = params?.spaceId;
  // Will default to new tab open by url jumping
  const go = getHistoryMethod(method, options);

  await toggleSpace(spaceId);

  const result = RouterStrategy[path](info) as IFunctionResult;
  const pathUrl = result[0];

  if (!pathUrl) {
    return;
  }

  go(pathUrl, result[1], result[2]);
}
