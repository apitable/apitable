import dynamic from 'next/dynamic';
import React from 'react';

const ApplyLogoutWithNoSSR = dynamic(() => import('pc/components/home/apply_logout/apply_logout'), { ssr: false });

const App = () => {
  return <ApplyLogoutWithNoSSR />;
};

export default App;
