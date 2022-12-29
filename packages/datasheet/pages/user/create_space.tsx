import dynamic from 'next/dynamic';
import React from 'react';

const CreateSpaceWithNoSSR = dynamic(() => import('pc/components/create_space/create_space'), { ssr: false });

const App = () => {
  return <CreateSpaceWithNoSSR />;
};

export default App;
