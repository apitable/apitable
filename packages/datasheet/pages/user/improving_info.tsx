import dynamic from 'next/dynamic';
import React from 'react';

const ImprovingInfoWithNoSSR = dynamic(() => import('pc/components/home/improving_info/improving_info'), { ssr: false });

const App = () => {
  return <ImprovingInfoWithNoSSR />;
};

export default App;
