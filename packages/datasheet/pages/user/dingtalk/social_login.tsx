import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingTalkLoginWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingTalkLogin;
}), { ssr: false });

const App = () => {
  return DingTalkLoginWithNoSSR && <DingTalkLoginWithNoSSR />;
};

export default App;
