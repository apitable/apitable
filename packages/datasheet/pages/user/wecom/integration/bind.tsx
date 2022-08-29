import dynamic from 'next/dynamic';
import React from 'react';

const WecomIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_integration'), { ssr: false });
const WecomIntegrationBindWithNoSSR =
  dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_integration_bind/wecom_integration_bind'), { ssr: false });

const App = () => {
  return <WecomIntegrationWithNoSSR>
    <WecomIntegrationBindWithNoSSR />
  </WecomIntegrationWithNoSSR>;
};

export default App;
