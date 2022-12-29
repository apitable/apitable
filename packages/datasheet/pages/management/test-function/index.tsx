import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr:false });
const TestFunctionWithNoSSR = dynamic(() => import('pc/components/navigation/account_center_modal/test_function'), { ssr:false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR>
      <TestFunctionWithNoSSR />
    </DynamicComponentWithNoSSR>
  </>;
};

export default App;
