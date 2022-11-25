import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const FeiShuAdminLoginWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.FeiShuAdminLogin;
}), { ssr: false });

const App = () => {
  return FeiShuAdminLoginWithNoSSR && <FeiShuAdminLoginWithNoSSR />;
};

export default App;
