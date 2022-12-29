import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeiShuUserAuthWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeiShuUserAuth;
}), { ssr: false });

const App = () => {
  return FeiShuUserAuthWithNoSSR && <FeiShuUserAuthWithNoSSR />;
};

export default App;
