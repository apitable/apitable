import dynamic from 'next/dynamic';
import React from 'react';

const DingTalkLoginWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk/login'), { ssr: false });

const App = () => {
  return <DingTalkLoginWithNoSSR />;
};

export default App;
