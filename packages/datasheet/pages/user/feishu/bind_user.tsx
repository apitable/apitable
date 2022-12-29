import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeiShuBindUserWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeiShuBindUser;
}), { ssr: false });

const App = () => {
  return FeiShuBindUserWithNoSSR && <FeiShuBindUserWithNoSSR />;
};

export default App;
