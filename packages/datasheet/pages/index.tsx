import { Url } from '@apitable/core';
import axios from 'axios';
import { NextPageContext } from 'next';

const App = () => {
  return null;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const host = process.env.API_PROXY;
  axios.defaults.baseURL = host + Url.BASE_URL;

  if (!context.req?.url) {
    return { props: {}};
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
  unstable_includeFiles: [
    '../../node_modules/next/dist/compiled/@edge-runtime/primitives/**/*.+(js|json)'
  ],
};

export default App;
