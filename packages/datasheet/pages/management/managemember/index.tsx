import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr:false });
const ManageMemberWithNoSSR = dynamic(() => import('pc/components/space_manage/space_member_manage'), { ssr:false });
const ManageAuthWithNoSSR = dynamic(() => import('pc/components/space_manage/manage_auth'), { ssr:false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR>
      <ManageAuthWithNoSSR>
        <ManageMemberWithNoSSR />
      </ManageAuthWithNoSSR>
    </DynamicComponentWithNoSSR>
  </>;
};

export default App;
