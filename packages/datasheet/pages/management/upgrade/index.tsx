import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr: false });
const UpgradeSpaceWithNoSSR = dynamic(() => import('pc/components/space_manage/upgrade_space/upgrade_space'), { ssr: false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR>
      <UpgradeSpaceWithNoSSR />
    </DynamicComponentWithNoSSR>
  </>;
};

export default App;
