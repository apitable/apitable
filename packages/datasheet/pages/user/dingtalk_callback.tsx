import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingTalkH5WithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingTalkH5;
}), { ssr: false });

const App = () => {
  return DingTalkH5WithNoSSR && <DingTalkH5WithNoSSR />;
};

export default App;
