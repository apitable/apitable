import dynamic from 'next/dynamic';
import React from 'react';

const FeishuCallbackWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu_integration/feishu_callback'), { ssr: false });

const App = () => {
  return <FeishuCallbackWithNoSSR />;
};

export default App;
