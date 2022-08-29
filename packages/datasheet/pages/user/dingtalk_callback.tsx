import dynamic from 'next/dynamic';
import React from 'react';

const DingTalkH5WithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk_h5/dingtalk_h5'), { ssr: false });

const App = () => {
  return <DingTalkH5WithNoSSR />;
};

export default App;
