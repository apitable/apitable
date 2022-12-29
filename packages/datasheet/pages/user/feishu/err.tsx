import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuErrWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuErr;
}), { ssr: false });

const App = () => {
  return FeishuErrWithNoSSR && <FeishuErrWithNoSSR />;
};

export default App;
