import dynamic from 'next/dynamic';
import React from 'react';

const DingTalkH5LoginWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk_h5/dingtalk_login'), { ssr: false });

const App = () => {
  return <DingTalkH5LoginWithNoSSR />;
};

export default App;
