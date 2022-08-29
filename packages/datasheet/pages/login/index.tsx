import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('pc/components/home'), { ssr: false });

const App = () => {
  return <>
    <DynamicComponentWithNoSSR />
  </>;
};

export default App;
