import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeiShuConfigureWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeiShuConfigure;
}), { ssr: false });

const App = () => {
  return FeiShuConfigureWithNoSSR && <FeiShuConfigureWithNoSSR />;
};

export default App;
