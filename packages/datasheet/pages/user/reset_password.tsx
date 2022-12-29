import dynamic from 'next/dynamic';
import React from 'react';

const ResetPasswordWithNoSSR = dynamic(() => import('pc/components/reset_password/reset_password'), { ssr: false });

const App = () => {
  return <ResetPasswordWithNoSSR />;
};

export default App;
