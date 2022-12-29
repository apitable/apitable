import React from 'react';
// @ts-ignore
import { WecomIntegration, WecomConfig } from 'enterprise';

const App = () => {
  return <WecomIntegration>
    <WecomConfig />
  </WecomIntegration>;
};

export default App;
