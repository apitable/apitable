import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/org_router'), { ssr: false });

const App = (props) => {
  return <>
    <DynamicComponentWithNoSSR />
  </>;
};

export default App;
