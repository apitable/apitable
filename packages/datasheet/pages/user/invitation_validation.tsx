import dynamic from 'next/dynamic';
import React from 'react';

const InvitationValidationWithNoSSR = dynamic(() => import('pc/components/home/invitation_validation/invitation_validation'), { ssr: false });

const App = () => {
  return <InvitationValidationWithNoSSR />;
};

export default App;
