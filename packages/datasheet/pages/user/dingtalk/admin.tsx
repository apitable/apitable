import dynamic from 'next/dynamic';
import React from 'react';

const DingTalkAdminWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk/admin'), { ssr: false });

const App = () => {
  return <DingTalkAdminWithNoSSR />;
};

export default App;
