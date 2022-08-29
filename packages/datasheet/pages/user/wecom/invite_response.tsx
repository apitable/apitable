import dynamic from 'next/dynamic';
import { isWecomFunc } from 'pc/components/home/social_platform';
import React from 'react';

const WecomInviteWithNoSSR = dynamic(() => import('pc/components/home/social_platform/wecom_invite/wecom_invite'), { ssr: false });

const App = () => {
  if(!isWecomFunc()){
    return null;
  }
  return <WecomInviteWithNoSSR />;
};

export default App;
