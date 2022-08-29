import dynamic from 'next/dynamic';
import React from 'react';

const FeiShuBindSpaceWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_bind_space'), { ssr: false });

const App = () => {
  return <FeiShuBindSpaceWithNoSSR />;
};

export default App;
