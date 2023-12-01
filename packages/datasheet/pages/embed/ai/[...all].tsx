/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2023 APITable Ltd. <https://apitable.com>
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
import dynamic from 'next/dynamic';
import React from 'react';
import { Api, IShareInfo } from '@apitable/core';
import { getRegResult, shareIdReg } from 'pc/hooks';
import { getBaseUrl } from '../../../utils/get_base_url';

const PublishPage = dynamic(
  () =>
    // @ts-ignore
    import('enterprise/embed/ai').then((components) => {
      return components.PublishPage;
    }),
  { ssr: false },
);

const App = (props: { shareInfo: Required<IShareInfo> | undefined }) => {
  // @ts-ignore
  return <PublishPage {...props} />;
};

export const getServerSideProps = async (context: NextPageContext) => {
  axios.defaults.baseURL = getBaseUrl(context);

  if (!context.req?.url) {
    return { props: {} };
  }

  const shareId = getRegResult(context.req.url, shareIdReg);

  if (!shareId) {
    return { props: {} };
  }

  const cookie = context.req?.headers.cookie;

  const headers: Record<string, string> = {};

  if (cookie) {
    headers.cookie = cookie;
  }

  const res = await Api.readShareInfo(shareId, headers);
  const { success, data } = res.data;

  if (success) {
    return {
      props: {
        shareInfo: data,
      },
    };
  }
  return {
    props: {},
  };
};

export default App;
