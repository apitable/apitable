import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr: false });
const SpaceCockpitWithNoSSR = dynamic(() => import('pc/components/space_manage/space_info/space_cockpit'), { ssr: false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR>
      <SpaceCockpitWithNoSSR />
    </DynamicComponentWithNoSSR>
  </>;
};

export default App;
