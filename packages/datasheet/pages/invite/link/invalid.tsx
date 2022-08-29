import dynamic from 'next/dynamic';
import React from 'react';

const LinkInvalidWithNoSSR = dynamic(() => import('pc/components/invite/link_invite/link_invalid'), { ssr: false });

const App = () => {
  return <LinkInvalidWithNoSSR />;
};

export default App;
