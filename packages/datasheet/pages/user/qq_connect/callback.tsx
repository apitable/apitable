import dynamic from 'next/dynamic';
import React from 'react';

const QqCallbackWithNoSSR = dynamic(() => import('pc/components/home/qq_callback/qq_callback'), { ssr: false });

const App = () => {
  return <QqCallbackWithNoSSR />;
};

export default App;
