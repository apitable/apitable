import { Api, Url } from '@vikadata/core';
import axios from 'axios';
import { getEnvVars } from 'get_env';
import { getPageParams, getRegResult, spaceIdReg } from 'pc/hooks';
import { NextPageContext } from 'next';

export interface IUserInfoError {
  code: number;
  message: string;
}

export const getInitialProps = async(context: { ctx: NextPageContext }) => {
  const envVars = getEnvVars();
  const cookie = context.ctx.req?.headers.cookie;

  const baseResponse = {
    env: process.env.ENV,
    version: process.env.WEB_CLIENT_VERSION,
    envVars: JSON.stringify(envVars)
  };

  const host = process.env.API_PROXY;

  if (!host) {
    return baseResponse;
  }

  axios.defaults.baseURL = host + Url.BASE_URL;
  const language = context.ctx.req?.headers['accept-language'];
  const headers: Record<string, string> = {};

  if (cookie) {
    headers.cookie = cookie;
  }

  if (language) {
    headers['Accept-Language'] = language;
  }

  const spaceId = context.ctx.query?.spaceId || '';

  const res = await axios.get('/client/info', { params: { spaceId }, headers: headers });

  const pathUrl = context.ctx.req?.url;
  let userInfo = res.data.userInfo;
  let userInfoError: IUserInfoError | undefined;
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
    )
  ) {
    const { nodeId } = getPageParams(pathUrl);
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
