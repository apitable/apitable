import dynamic from 'next/dynamic';
import React from 'react';

const MailInviteWithNoSSR = dynamic(() => import('pc/components/invite/mail_invite/mail_invite'), { ssr: false });

const App = () => {
  return <>
    <MailInviteWithNoSSR />
  </>;
};

export default App;
