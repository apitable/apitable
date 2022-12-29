import React from 'react';
// @ts-ignore
import { WecomIntegration, WecomBindSuccess } from 'enterprise';


const App = () => {
  return <WecomIntegration>
    <WecomBindSuccess />
  </WecomIntegration>;
};

export default App;
