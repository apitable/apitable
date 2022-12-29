import dynamic from 'next/dynamic';
import React from 'react';

const NotifyRouterWithNoSSR = dynamic(() => import('pc/components/route_manager/notify_router'), { ssr:false });

const App = () => {
  return <>
    <NotifyRouterWithNoSSR />
  </>;
};

export default App;
