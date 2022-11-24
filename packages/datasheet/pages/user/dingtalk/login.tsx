import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingTalkH5LoginWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingTalkH5Login;
}), { ssr: false });

const App = () => {
  return DingTalkH5LoginWithNoSSR && <DingTalkH5LoginWithNoSSR />;
};

export default App;
