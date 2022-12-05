import React from 'react';
// @ts-ignore
import { WecomIntegration, WecomToBind } from 'enterprise';

const App = () => {
  return <WecomIntegration>
    <WecomToBind />
  </WecomIntegration>;
};

export default App;
