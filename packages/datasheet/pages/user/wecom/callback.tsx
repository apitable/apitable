import dynamic from 'next/dynamic';
import React from 'react';

const WecomCallbackWithNoSSR = dynamic(() => import('pc/components/home/wecom_callback/wecom_callback'), { ssr: false });

const App = () => {
  return <WecomCallbackWithNoSSR />;
};

export default App;
