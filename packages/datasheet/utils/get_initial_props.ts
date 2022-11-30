import { getEnvVars } from 'get_env';
import { NextPageContext } from 'next';
import axios from 'axios';
import { FILTER_HEADERS } from './constant';
import { Url } from '@apitable/core';

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

  return {
    ...baseResponse,
    locale: res.data.locale,
  }
}