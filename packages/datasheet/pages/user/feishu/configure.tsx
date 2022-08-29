import dynamic from 'next/dynamic';
import React from 'react';

const FeiShuConfigureWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_configure'), { ssr: false });

const App = () => {
  return <FeiShuConfigureWithNoSSR />;
};

export default App;
