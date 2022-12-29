import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeiShuBindSpaceWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeiShuBindSpace;
}), { ssr: false });

const App = () => {
  return FeiShuBindSpaceWithNoSSR && <FeiShuBindSpaceWithNoSSR />;
};

export default App;
