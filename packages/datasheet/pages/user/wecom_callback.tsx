import dynamic from 'next/dynamic';
import React from 'react';

const WecomLoginWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_login'), { ssr: false });

const App = () => {
  return <WecomLoginWithNoSSR />;
};

export default App;
