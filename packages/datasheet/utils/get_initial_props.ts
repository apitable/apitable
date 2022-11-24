import { Api, Url } from '@apitable/core';
import { FILTER_HEADERS } from './constant';
import axios from 'axios';
import { getEnvVars } from 'get_env';
import { NextPageContext } from 'next';
import { getPageParams, getRegResult, spaceIdReg } from 'pc/hooks';
import { setClientCookie } from '../utils/utils';

export interface IUserInfoError {
  code: number;
  message: string;
}

const filterCustomHeader = (headers?: Record<string, string | string[] | undefined>): Record<string, string> => {
  if (!headers) return {};
  const _headers = {};
  for (const k in headers) {
    if (!FILTER_HEADERS.map(item => item.toUpperCase()).includes(k.toUpperCase())) {
      continue;
    }
    _headers[k] = headers[k];
  }
  return _headers;
};

export const getInitialProps = async(context: { ctx: NextPageContext }) => {
  const envVars = getEnvVars();
  const cookie = context.ctx.req?.headers.cookie;
  const filterHeaders = filterCustomHeader(context.ctx.req?.headers);

  const baseResponse = {
    env: process.env.ENV,
    version: process.env.WEB_CLIENT_VERSION,
    envVars: JSON.stringify(envVars),
    headers: JSON.stringify(filterHeaders)
  };

  const host = process.env.API_PROXY;

  if (!host) {
    return {
      clientInfo: baseResponse
    };
  }

  axios.defaults.baseURL = host + Url.BASE_URL;
  const language = context.ctx.req?.headers['accept-language'];
  const headers: Record<string, string> = { ...filterHeaders };

  if (cookie) {
    headers.cookie = cookie;
  }

  if (language) {
    headers['Accept-Language'] = language;
  }

  const spaceId = context.ctx.query?.spaceId || '';
  const res = await axios.get('/client/info', { params: { spaceId }, headers: headers });

  Array.isArray(res.headers['set-cookie']) && setClientCookie(res.headers['set-cookie'], context.ctx);

  const pathUrl = context.ctx.req?.url;
  let userInfo = res.data.userInfo;

  let userInfoError: IUserInfoError | undefined;
  const { nodeId } = getPageParams(pathUrl || '');

  /**
   * If there is no nodeId or spaceId in the pathUrl, the userInfo returned by user/me and client/info is actually the same, so there is no need to repeat the request.
   */
  if (
    pathUrl &&
    (
      pathUrl.startsWith('/workbench') ||
      pathUrl.startsWith('/org') ||
      pathUrl.startsWith('/notification') ||
      pathUrl.startsWith('/management') ||
      pathUrl.includes('/tpl') ||
      pathUrl.includes('/space') ||
      pathUrl.includes('/login')
    ) &&
    (nodeId || spaceId)
  ) {
    const spaceId = getRegResult(pathUrl, spaceIdReg);
    const res = await Api.getUserMe({ nodeId, spaceId }, false, headers);
    const { data, success, message, code } = res.data;

    if (success) {
      userInfo = JSON.stringify(data);
    } else {
      userInfoError = {
        code,
        message
      };
    }
  }

  return {
    clientInfo: {
      locale: res.data.locale,
      wizards: res.data.wizards,
      metaContent: res.data.metaContent,
      userInfo,
      userInfoError: userInfoError,
      ...baseResponse
    },
    pathUrl
  };
};

