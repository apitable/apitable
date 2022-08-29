import dynamic from 'next/dynamic';
import React from 'react';

const WecomIntegrationWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_integration'), { ssr: false });
const WecomToBindWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_to_bind'), { ssr: false });

const App = () => {
  return <WecomIntegrationWithNoSSR>
    <WecomToBindWithNoSSR />
  </WecomIntegrationWithNoSSR>;
};

export default App;
