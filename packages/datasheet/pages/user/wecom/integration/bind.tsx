import React from 'react';
// @ts-ignore
import { WecomIntegration, WecomIntegrationBind } from 'enterprise';

const App = () => {
  return <WecomIntegration>
    <WecomIntegrationBind />
  </WecomIntegration>;
};

export default App;
