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