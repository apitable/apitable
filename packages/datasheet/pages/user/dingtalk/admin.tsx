import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingTalkAdminWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingTalkAdmin;
}), { ssr: false });

const App = () => {
  return DingTalkAdminWithNoSSR && <DingTalkAdminWithNoSSR />;
};

export default App;
