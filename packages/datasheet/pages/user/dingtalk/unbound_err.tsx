import dynamic from 'next/dynamic';
import React from 'react';

const DingtalkUnboundErrWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk_h5/dingtalk_err'), { ssr: false });

const App = () => {
  return <DingtalkUnboundErrWithNoSSR />;
};

export default App;
