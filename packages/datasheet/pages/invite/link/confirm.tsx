import dynamic from 'next/dynamic';
import React from 'react';

const LinkConfirmWithNoSSR = dynamic(() => import('pc/components/invite/link_invite/link_confirm'), { ssr: false });

const App = () => {
  return <LinkConfirmWithNoSSR />;
};

export default App;
