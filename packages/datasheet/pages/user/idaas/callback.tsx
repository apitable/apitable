import dynamic from 'next/dynamic';
import React from 'react';

const IdassCallbackWithNoSSR = dynamic(() => import('pc/components/home/idass_callback/idass_callback'), { ssr: false });

const App = () => {
  return <IdassCallbackWithNoSSR />;
};

export default App;
