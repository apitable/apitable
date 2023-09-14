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

import axios from 'axios';
import { NextPageContext } from 'next';
import { getBaseUrl } from '../utils/get_base_url';

const App = () => {
  return null;
};

export const getServerSideProps = async (context: NextPageContext) => {
  axios.defaults.baseURL = getBaseUrl(context);

  if (!context.req?.url) {
    return { props: {} };
  }
  const cookie = context.req?.headers.cookie;
  const headers: Record<string, string> = {};

  if (cookie) {
    headers.cookie = cookie;
  }

  const spaceId = context.query?.spaceId || '';
  const res = await axios.get('/client/info', { params: { spaceId }, headers: headers });

  const userInfo = res.data.userInfo;

  if (!userInfo || userInfo === 'null') {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    };
  }
  return {
    redirect: {
      destination: '/workbench',
      statusCode: 302,
    },
  };
};

export const config = {
  unstable_includeFiles: ['../../node_modules/next/dist/compiled/@edge-runtime/primitives/**/*.+(js|json)'],
};

export default App;
