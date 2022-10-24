import { Api, Url } from '@apitable/core';
import axios from 'axios';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { getRegResult, shareIdReg } from 'pc/hooks';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('../../src/pc/components/share/share'), { ssr: false });

const App = (props) => {
  return <>
    <DynamicComponentWithNoSSR {...props} />
  </>;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const host = process.env.API_PROXY;
  axios.defaults.baseURL = host + Url.BASE_URL;

  if (!context.req?.url) {
    return { props: {}};
  }

  const shareId = getRegResult(context.req.url, shareIdReg);

  if (!shareId) {
    return { props: {}};
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
        shareInfo: data
      }
    };
  }
  return {
    props: {}
  };
};

export default App;

