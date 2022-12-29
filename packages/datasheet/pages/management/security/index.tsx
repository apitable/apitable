import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr:false });
// @ts-ignore
const SecurityWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.Security;
}), { ssr: false });
const ManageAuthWithNoSSR = dynamic(() => import('pc/components/space_manage/manage_auth'), { ssr:false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR>
      <ManageAuthWithNoSSR>
        {SecurityWithNoSSR && <SecurityWithNoSSR />}
      </ManageAuthWithNoSSR>
    </DynamicComponentWithNoSSR>
  </>;
};

export default App;
