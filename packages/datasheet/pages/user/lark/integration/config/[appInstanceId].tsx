import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuIntegrationWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuIntegration;
}), { ssr: false });

// @ts-ignore
const FeishuConfigWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuConfig;
}), { ssr: false });

const App = () => {
  return FeishuIntegrationWithNoSSR && FeishuConfigWithNoSSR && <FeishuIntegrationWithNoSSR>
    <FeishuConfigWithNoSSR />
  </FeishuIntegrationWithNoSSR>;
};

export default App;
