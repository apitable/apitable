import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr:false });
const ManageAuthWithNoSSR = dynamic(() => import('pc/components/space_manage/manage_auth'), { ssr:false });
const RoleWithNoSSR = dynamic(() => import('pc/components/space_manage/role/role'), { ssr:false });

const App = () => {
  return (
    <DynamicComponentWithNoSSR>
      <ManageAuthWithNoSSR>
        <RoleWithNoSSR />
      </ManageAuthWithNoSSR>
    </DynamicComponentWithNoSSR>
  );
};

export default App;
