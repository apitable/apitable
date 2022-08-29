import dynamic from 'next/dynamic';
import React from 'react';

const FeiShuBindUserWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_bind_user'), { ssr: false });

const App = () => {
  return <FeiShuBindUserWithNoSSR />;
};

export default App;
