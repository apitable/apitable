import dynamic from 'next/dynamic';
import React from 'react';

const LinkLoginWithNoSSR = dynamic(() => import('pc/components/invite/link_invite/link_login'), { ssr: false });

const App = () => {
  return <LinkLoginWithNoSSR />;
};

export default App;
