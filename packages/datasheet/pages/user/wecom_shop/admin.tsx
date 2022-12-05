import dynamic from 'next/dynamic';
import React from 'react';

const WecomAdminWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom/admin'), { ssr: false });

const App = () => {
  return <WecomAdminWithNoSSR />;
};

export default App;
