import dynamic from 'next/dynamic';
import React from 'react';

const FeishuErrWithNoSSR = dynamic(() => import('pc/components/home/feishu/feishu_err'), { ssr: false });

const App = () => {
  return <FeishuErrWithNoSSR />;
};

export default App;
