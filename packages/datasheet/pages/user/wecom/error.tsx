import dynamic from 'next/dynamic';
import React from 'react';

const WecomErrorWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_integration/wecom_error'), { ssr: false });

const App = () => {
  return <WecomErrorWithNoSSR />;
};

export default App;
