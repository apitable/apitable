import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuIntegrationWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuIntegration;
}), { ssr: false });

// @ts-ignore
const FeishuIntegrationBindWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuIntegrationBind;
}), { ssr: false });

const App = () => {
  return FeishuIntegrationWithNoSSR && FeishuIntegrationBindWithNoSSR && <FeishuIntegrationWithNoSSR>
    <FeishuIntegrationBindWithNoSSR />
  </FeishuIntegrationWithNoSSR>;
};

export default App;
