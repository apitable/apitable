/**
 * Next 中间件，类似于拦截器，常见示例包括身份验证、A/B 测试等
 * 中间件会拦截config:matcher配置的资源，为了尽可能的不影响性能这个应该做到足够`快`
 *
 * @see https://nextjs.org/docs/advanced-features/middleware
 * @see https://nextjs.org/docs/messages/middleware-upgrade-guide
 * @see https://github.com/vercel/next.js/discussions/29750
 */
import { NextRequest, NextResponse } from 'next/server';

/*
 * 金丝雀灰度标识
 */
const _canaryTestingUrlFlag = 'spaceId';

const urlCheck = (path: string) => {
  const allowPath = ['/', '/workbench', '/org', 'management', '/notify', '/template'];
  return allowPath.some(v => path === v);
};

/**
 * 金丝雀测试（灰度测试）
 * 方法主要作用
 * 1：对直接访问域名的请求添加UrlParams?[spaceId=spcxxx]来给网关一个标识识别资源，判断流量走向
 * 2：删除非灰度流量下切换空间站UrlParams上的[spaceId=spcxxx]参数
 *
 *  @param request next 请求对象
 *  @see https://vikadata.feishu.cn/docx/doxcnD8Syt3UxJUTlRGRhxbLC3f [网关灰度处理流程]
 */
const canaryTestingByFillUpUrlPathFlag = async (request: NextRequest): Promise<NextResponse> => {
  const url = request.nextUrl.clone();
  const searchParams = url.searchParams;

  if (urlCheck(url.pathname)) {
    const headers = {
      cookie: request.headers.get('cookie')!
    };

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
       * 灰度环境带上spaceId，为了给网关识别流量
       * 举个栗子： /workbench => /workbench?spaceId=spcxxxxxx
       */
      if (res?.spaceGrayEnv && !searchParams.has(_canaryTestingUrlFlag)) {
        url.searchParams.set(_canaryTestingUrlFlag, userInfo?.spaceId);
        return NextResponse.redirect(url);
      }
      /*
       * 非灰度环境，但是存在spaceId，主动删除spaceId
       */
      if (!res?.spaceGrayEnv && searchParams.has(_canaryTestingUrlFlag)) {
        searchParams.delete(_canaryTestingUrlFlag);
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  let response;
  /*
   * 📢为了避免出现一些例外的情况导致一些响应上的错误，这里对方法体try一下，只要出现错误直接放行
   */
  try {
    // 1.金丝雀测试
    response = await canaryTestingByFillUpUrlPathFlag(request);

  } catch (error) {
    console.error('middleware error', error);
    response = NextResponse.next();
  }
  return response;
}

export const config = {
  matcher: ['/:path*'],
}