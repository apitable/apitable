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

/**
 * Next middleware, similar to an interceptor, common examples include authentication, A/B testing, etc.
 * The middleware will intercept the resources configured in config:matcher,
 * in order not to affect performance as much as possible this should be done `fast enough`.
 *
 * @see https://nextjs.org/docs/advanced-features/middleware
 * @see https://nextjs.org/docs/messages/middleware-upgrade-guide
 * @see https://github.com/vercel/next.js/discussions/29750
 */
import { NextRequest, NextResponse } from 'next/server';

/*
 * The flag of Canary Testing
 */
const _canaryTestingUrlFlag = 'spaceId';

const urlCheck = (path: string) => {
  const allowPath = ['/', '/workbench', '/org', '/management', '/notify', '/template'];
  return allowPath.some(v => path === v);
};

/**
 * Canary test (grayscale test)
 * The main role of the method
 * 1：Add UrlParams?[spaceId=spcxxx] to requests for direct domain access to give the gateway an identifier to
 * identify the resource and determine where the traffic is going
 * 2：Delete the [spaceId=spcxxx] parameter on the UrlParams for switching space stations under non-grayscale traffic
 *
 *  @param request next request object
 *  @see https://vikadata.feishu.cn/docx/doxcnD8Syt3UxJUTlRGRhxbLC3f [Gateway grayscale processing flow]
 */
const canaryTestingByFillUpUrlPathFlag = async(request: NextRequest): Promise<NextResponse> => {
  const url = request.nextUrl.clone();
  const searchParams = url.searchParams;

  if (urlCheck(url.pathname)) {
    const headers = {
      cookie: request.headers.get('cookie')!,
    };

    // for (const [k, v] of request.headers.entries()) {
    //   if (!FILTER_HEADERS.map(item => item.toUpperCase()).includes(k.toUpperCase())) {
    //     continue;
    //   }
    //   headers[k] = v;
    // }

    const host = process.env.API_PROXY || url.origin;
    const clientInfoApi = new URL(host + '/api/v1/client/info');
    const spaceId = searchParams.get(_canaryTestingUrlFlag);
    if (spaceId) {
      clientInfoApi.searchParams.append(_canaryTestingUrlFlag, spaceId);
    }
    const res = await (await fetch(clientInfoApi.toString(), {
      headers,
    })).json();

    const userInfo = JSON.parse(res?.userInfo);
    if (userInfo) {
      /*
       * Grayscale environment with spaceId, in order to identify traffic to the gateway
       * As an example： /workbench => /workbench?spaceId=spcxxxxxx
       */
      if (res?.spaceGrayEnv && !searchParams.has(_canaryTestingUrlFlag)) {
        url.searchParams.set(_canaryTestingUrlFlag, userInfo?.spaceId);
        return NextResponse.redirect(url);
      }
      /*
       * Non-grayscale environment, but spaceId exists, actively delete spaceId
       */
      if (!res?.spaceGrayEnv && searchParams.has(_canaryTestingUrlFlag)) {
        searchParams.delete(_canaryTestingUrlFlag);
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
};

export async function middleware(request: NextRequest) {
  let response;
  /*
   * 📢 In order to avoid some exceptions leading to some response errors,
   * here is a try on the method body, as long as there is an error directly release
   */
  try {
    // 1.Canary Test
    response = await canaryTestingByFillUpUrlPathFlag(request);

  } catch (error) {
    console.error('middleware error', error);
    response = NextResponse.next();
  }
  return response;
}

export const config = {
  matcher: ['/:path*'],
};
