import dynamic from 'next/dynamic';
import React from 'react';

const FeishuConfigureErrWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu/configure_err'), { ssr: false });

const App = () => {
  return <FeishuConfigureErrWithNoSSR />;
};

export default App;
