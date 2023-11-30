import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const BillingWithNoSSR = dynamic(
  () =>
    // @ts-ignore
    import('enterprise/management_billing/billing').then((components) => {
      return components.ManagementBilling;
    }),
  { ssr: false },
);

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/route_manager/management_router'), { ssr: false });

const App = () => {
  return <DynamicComponentWithNoSSR>{BillingWithNoSSR && <BillingWithNoSSR />}</DynamicComponentWithNoSSR>;
};

export default App;
