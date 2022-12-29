import { isWecomFunc } from 'pc/components/home/social_platform';
import React from 'react';
// @ts-ignore
import { WecomInvite } from 'enterprise';

const App = () => {
  if(!isWecomFunc()){
    return null;
  }
  return <WecomInvite />;
};

export default App;
