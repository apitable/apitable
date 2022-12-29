import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuIntegrationWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuIntegration;
}), { ssr: false });

const App = () => {
  return FeishuIntegrationWithNoSSR && <FeishuIntegrationWithNoSSR />;
};

export default App;
