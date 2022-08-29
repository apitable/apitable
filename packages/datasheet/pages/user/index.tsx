import dynamic from 'next/dynamic';
import React from 'react';

const NoMatchWithNoSSR = dynamic(() => import('pc/components/invalid_page/no_match/no_match'), { ssr: false });

const App = () => {
  return <NoMatchWithNoSSR />;
};

export default App;
