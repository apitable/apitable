import dynamic from 'next/dynamic';
import React from 'react';

const DingTalkBindSpaceWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk/bind_space'), { ssr: false });

const App = () => {
  return <DingTalkBindSpaceWithNoSSR />;
};

export default App;
