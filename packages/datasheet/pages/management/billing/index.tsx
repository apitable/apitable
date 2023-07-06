
import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const BillingWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.ManagementBilling;
}), { ssr: false });

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr: false });

const App = () => {
  return<DynamicComponentWithNoSSR>
    {BillingWithNoSSR && <BillingWithNoSSR />}
  </DynamicComponentWithNoSSR>;
};

export default App;