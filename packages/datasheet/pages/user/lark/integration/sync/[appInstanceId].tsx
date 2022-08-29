import dynamic from 'next/dynamic';
import React from 'react';

const FeishuIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu_integration/feishu_integration'), { ssr: false });

const App = () => {
  return <FeishuIntegrationWithNoSSR />;
};

export default App;
