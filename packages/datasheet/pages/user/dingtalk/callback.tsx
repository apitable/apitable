import dynamic from 'next/dynamic';
import React from 'react';

const DingdingCallbackWithNoSSR = dynamic(() => import('pc/components/home/dingding_callback/dingding_callback'), { ssr: false });

const App = () => {
  return <DingdingCallbackWithNoSSR />;
};

export default App;
