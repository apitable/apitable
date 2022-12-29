import dynamic from 'next/dynamic';
import React from 'react';

const MailBindPhoneWithNoSSR = dynamic(() => import('pc/components/invite/mail_invite/mail_bind_phone'), { ssr: false });

const App = () => {
  return <MailBindPhoneWithNoSSR />;
};

export default App;
