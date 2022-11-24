import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingtalkCallbackWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingtalkCallback;
}), { ssr: false });

const App = () => {
  return DingtalkCallbackWithNoSSR && <DingtalkCallbackWithNoSSR />;
};

export default App;
