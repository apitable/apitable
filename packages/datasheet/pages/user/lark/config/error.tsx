import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeishuCallbackWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeishuCallback;
}), { ssr: false });

const App = () => {
  return FeishuCallbackWithNoSSR && <FeishuCallbackWithNoSSR />;
};

export default App;
