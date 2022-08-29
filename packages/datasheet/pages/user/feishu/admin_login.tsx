import dynamic from 'next/dynamic';
import React from 'react';

const FeiShuAdminLoginWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_admin_login'), { ssr: false });

const App = () => {
  return <FeiShuAdminLoginWithNoSSR />;
};

export default App;
