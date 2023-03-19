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

import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { getRegResult, embedIdReg } from 'pc/hooks';
import React from 'react';
// @ts-ignore
import { IEmbedProps } from 'enterprise';

// @ts-ignore
const DynamicComponentWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.Embed;
}), { ssr: false });

const App = (props: IEmbedProps) => {
  return DynamicComponentWithNoSSR && <DynamicComponentWithNoSSR {...props} />;
};

export const getServerSideProps = (context: NextPageContext) => {

  if (!context.req?.url) {
    return { props: {}};
  }

  const embedId = getRegResult(context.req.url, embedIdReg);

  if (!embedId) {
    return { props: {}};
  }

  const cookie = context.req?.headers.cookie;

  const headers: Record<string, string> = {};

  if (cookie) {
    headers.cookie = cookie;
  }

  return {
    props: {
      embedId,
      headers
    }
  };
};

export default App;