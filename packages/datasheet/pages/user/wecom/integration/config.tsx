import dynamic from 'next/dynamic';
import React from 'react';

const WecomIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_integration'), { ssr: false });
const WecomConfigWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_config'), { ssr: false });

const App = () => {
  return <WecomIntegrationWithNoSSR>
    <WecomConfigWithNoSSR />
  </WecomIntegrationWithNoSSR>;
};

export default App;
