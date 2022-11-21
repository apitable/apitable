import { Api, Url } from '@apitable/core';
import axios from 'axios';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { getRegResult, embedIdReg } from 'pc/hooks';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('../../src/pc/components/embed/embed'), { ssr: false });

const App = (props) => {
  return <>
    <DynamicComponentWithNoSSR {...props} />
  </>;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const host = process.env.API_PROXY;
  axios.defaults.baseURL = host + Url.NEST_BASE_URL;

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

  const res = await Api.getEmbedLinkInfo(embedId, headers);
  const { success, data } = res.data;
  if (success) {
    return {
      props: {
        embedInfo: data
      }
    };
  }
  return {
    props: {}
  };
};

export default App;