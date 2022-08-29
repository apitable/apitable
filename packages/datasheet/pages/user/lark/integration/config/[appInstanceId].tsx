import dynamic from 'next/dynamic';
import React from 'react';

const FeishuIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu_integration/feishu_integration'), {});
const FeishuConfigWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu_integration/feishu_integration_config'), {});

const App = () => {
  return <FeishuIntegrationWithNoSSR>
    <FeishuConfigWithNoSSR />
  </FeishuIntegrationWithNoSSR>;
};

export default App;
