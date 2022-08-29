import dynamic from 'next/dynamic';
import React from 'react';

const FeishuAdminWithNoSSR = dynamic(() => import('pc/components/home/social_platform/feishu/admin/admin'), { ssr: false });

const App = () => {
  return <FeishuAdminWithNoSSR />;
};

export default App;
