import Router from 'next/router';
import React, { useEffect } from 'react';

const App = () => {

  useEffect(() => {
    Router.replace('management/overview');
  }, []);

  return <></>;
};

export default App;
