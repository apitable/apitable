import dynamic from 'next/dynamic';
import React from 'react';

const MailMismatchWithNoSSR = dynamic(() => import('pc/components/invite/mail_invite/mail_mismatch'), { ssr: false });

const App = () => {
  return <>
    <MailMismatchWithNoSSR />
  </>;
};

export default App;
