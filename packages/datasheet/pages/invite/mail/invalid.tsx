import dynamic from 'next/dynamic';
import React from 'react';

const MailInvalidWithNoSSR = dynamic(() => import('pc/components/invite/mail_invite/mail_invalid'), { ssr: false });

const App = () => {
  return <MailInvalidWithNoSSR />;
};

export default App;
