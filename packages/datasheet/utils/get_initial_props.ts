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

import { getEnvVars } from 'get_env';
import { NextPageContext } from 'next';
import { FILTER_HEADERS } from './constant';

const LANG_MAP = {
  en_US: 'en-US',
  zh_CN: 'zh-CN',
};

const filterCustomHeader = (headers?: Record<string, string | string[] | undefined>): Record<string, string> => {
  if (!headers) return {};
  const _headers = {};
  for (const k in headers) {
    if (!FILTER_HEADERS.map((item) => item.toUpperCase()).includes(k.toUpperCase())) {
      continue;
    }
    _headers[k] = headers[k];
  }
  return _headers;
};

export const getInitialProps = (context: { ctx: NextPageContext }) => {
  const envVars = getEnvVars();
  const cookie = context.ctx.req?.headers.cookie;
  const filterHeaders = filterCustomHeader(context.ctx.req?.headers);

  const baseResponse = {
    env: process.env.ENV,
    version: process.env.WEB_CLIENT_VERSION || 'development',
    envVars: JSON.stringify(envVars),
  };

  const language = context.ctx.req?.headers['accept-language'];
  const headers: Record<string, string> = { ...filterHeaders };

  const defaultLang = envVars.SYSTEM_CONFIGURATION_DEFAULT_LANGUAGE;
  let locale = defaultLang ? LANG_MAP[defaultLang] : 'zh-CN';
  if (cookie) {
    headers.cookie = cookie;
    const getCookie = (name: string) => {
      const value = `; ${cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length >= 2) return parts[1].split(';').shift();
      return null;
    };
    // server lang
    const langParts = getCookie('lang');
    locale = langParts || locale;
  }

  if (language) {
    headers['Accept-Language'] = language;
  }

  return {
    ...baseResponse,
    locale,
  };
};
