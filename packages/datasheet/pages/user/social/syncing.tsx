import dynamic from 'next/dynamic';
import React from 'react';

const ContactSyncingWithNoSSR = dynamic(() => import('pc/components/home/social_platform/dingtalk/contact_syncing/contact_syncing'), { ssr: false });

const App = () => {
  return <ContactSyncingWithNoSSR />;
};

export default App;
