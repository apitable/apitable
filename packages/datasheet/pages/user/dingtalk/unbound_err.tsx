import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const DingtalkUnboundErrWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.DingtalkUnboundErr;
}), { ssr: false });

const App = () => {
  return DingtalkUnboundErrWithNoSSR && <DingtalkUnboundErrWithNoSSR />;
};

export default App;
