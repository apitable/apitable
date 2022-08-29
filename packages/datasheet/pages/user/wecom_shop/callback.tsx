import dynamic from 'next/dynamic';
import React from 'react';

const WecomShopCallbackWithNoSSR = dynamic(() => import('pc/components/home/wecom_shop_callback/wecom_shop_callback'), { ssr: false });

const App = () => {
  return <WecomShopCallbackWithNoSSR />;
};

export default App;
