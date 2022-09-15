import { deleteCookie, setCookie } from 'cookies-next';
import { NextPageContext } from 'next';

export const getRequestHeaders = (context: NextPageContext) => {
  const headers: Record<string, string> = {};
  const language = context.req?.headers['accept-language'];
  const cookie = context.req?.headers.cookie;

  if (language) {
    headers['Accept-Language'] = language;
  }

  if (cookie) {
    headers.cookie = cookie;
  }

  return headers;
};

/**
 * ！！！！Warning
 * 当前的方法只会在 getInitProps 中调用，会将 client/info 中的 lang 配置写入 cookie，
 * lang 值仅作为 api 的请求头参数存在，前端不允许调用
 */
export const setClientCookie = (cookies: string[], ctx: NextPageContext) => {
  cookies.map(item => {
    let key: string = '';
    let value: string = '';
    const optional: Record<string, string | Date> = {};
    const _cookie = item.split('; ');

    _cookie.map((_item, _index) => {
      const result = _item.split('=');
      if (_index === 0) {
        key = result[0];
        value = result[1];
      } else {
        const _k = String(result[0]).toLowerCase();
        optional[_k] = _k === 'expires' ? new Date(result[1]) : result[1];
      }
    });

    /**
     * 如果这里不清除 sensorsdata2015jssdkcross，会出现下面的错误
     * Invalid character in header content ["cookie"]
     */
    deleteCookie('sensorsdata2015jssdkcross', { req: ctx.req, res: ctx.res });
    setCookie(key, value, { req: ctx.req, res: ctx.res, ...optional });
  });
};
