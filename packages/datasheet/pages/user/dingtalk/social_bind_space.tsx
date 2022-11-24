import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingTalkBindSpaceWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingTalkBindSpace;
}), { ssr: false });

const App = () => {
  return DingTalkBindSpaceWithNoSSR && <DingTalkBindSpaceWithNoSSR />;
};

export default App;
