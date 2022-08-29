import dynamic from 'next/dynamic';
import React from 'react';

const FeiShuUserAuthWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_user_auth'), { ssr: false });

const App = () => {
  return <FeiShuUserAuthWithNoSSR />;
};

export default App;
