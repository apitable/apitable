import dynamic from 'next/dynamic';
import React from 'react';

const MailLoginWithNoSSR = dynamic(() => import('pc/components/invite/mail_invite/mail_login'), { ssr: false });

const App = () => {
  return <MailLoginWithNoSSR />;
};

export default App;
