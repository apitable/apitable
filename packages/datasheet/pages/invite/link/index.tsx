import dynamic from 'next/dynamic';
import React from 'react';

const LinkInviteWithNoSSR = dynamic(() => import('pc/components/invite/link_invite/link_invite'), { ssr: false });

const App = () => {
  return <LinkInviteWithNoSSR />;
};

export default App;
