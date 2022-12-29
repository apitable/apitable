import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const WecomAdminWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.WecomAdmin;
}), { ssr: false });

const App = () => {
  return WecomAdminWithNoSSR && <WecomAdminWithNoSSR />;
};

export default App;
