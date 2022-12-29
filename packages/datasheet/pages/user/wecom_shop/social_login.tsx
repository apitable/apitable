import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const WecomLoginWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.WecomSocialLogin;
}), { ssr: false });

const App = () => {
  return WecomLoginWithNoSSR && <WecomLoginWithNoSSR />;
};

export default App;
