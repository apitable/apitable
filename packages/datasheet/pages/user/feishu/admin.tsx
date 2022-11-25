import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuAdminWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuAdmin;
}), { ssr: false });

const App = () => {
  return FeishuAdminWithNoSSR && <FeishuAdminWithNoSSR />;
};

export default App;
