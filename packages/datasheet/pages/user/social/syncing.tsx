import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const ContactSyncingWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.ContactSyncing;
}), { ssr: false });

const App = () => {
  return ContactSyncingWithNoSSR && <ContactSyncingWithNoSSR />;
};

export default App;
