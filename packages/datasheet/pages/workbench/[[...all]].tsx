import dynamic from 'next/dynamic';
import React from 'react';

const WorkbenchRouterWithNoSSR = dynamic(() => import('pc/components/route_manager/workbench_router'), { ssr: false });

const App = () => {
  return <>
    <WorkbenchRouterWithNoSSR />
  </>;
};

export default App;
