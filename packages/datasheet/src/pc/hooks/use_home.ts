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

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IQuery } from 'pc/components/route_manager/interface';

export function useQuery() {
  if (process.env.SSR) {
    return new Map();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * URLSearchParams
 * @param urlSearchParams
 * @returns
 */
const urlSearchParamsToObject = (urlSearchParams: URLSearchParams) => {
  const queryObj = {};
  urlSearchParams.forEach((value, key) => {
    queryObj[key] = value;
  });
  return queryObj;
};

export function useUrlQuery(): IQuery {
  const router = useRouter();
  const [query, setQuery] = useState<IQuery>(router.query);
  useEffect(() => {
    const routeChangeCompleteFn = (url: string) => {
      const queryStr = url?.split('?')?.[1];
      const urlSearchParams = new URLSearchParams(queryStr);
      setQuery(urlSearchParamsToObject(urlSearchParams));
    };
    router.events.on('routeChangeComplete', routeChangeCompleteFn);
    return () => router.events.off('routeChangeComplete', routeChangeCompleteFn);
  }, [router.events, setQuery]);
  return query;
}
