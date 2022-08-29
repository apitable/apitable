import dynamic from 'next/dynamic';
import React from 'react';

const WecomIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_integration'), { ssr: false });
const WecomBindSuccessWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_bind_success'), { ssr: false });

const App = () => {
  return <WecomIntegrationWithNoSSR>
    <WecomBindSuccessWithNoSSR />
  </WecomIntegrationWithNoSSR>;
};

export default App;
