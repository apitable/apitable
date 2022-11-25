import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuConfigureErrWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuConfigureErr;
}), { ssr: false });

const App = () => {
  return FeishuConfigureErrWithNoSSR && <FeishuConfigureErrWithNoSSR />;
};

export default App;
