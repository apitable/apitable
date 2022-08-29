import dynamic from 'next/dynamic';
import React from 'react';

const WechatCallbackWithNoSSR = dynamic(() => import('pc/components/home/wechat_callback/wechat_callback'), { ssr: false });

const App = () => {
  return <WechatCallbackWithNoSSR />;
};

export default App;
