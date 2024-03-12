import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const Auth0CallbackWithNoSSR = dynamic(
  () =>
    // @ts-ignore
    import('enterprise/auth0').then((components) => {
      return components.Auth0Callback;
    }),
  { ssr: false },
);

const App = () => {
  return Auth0CallbackWithNoSSR && <Auth0CallbackWithNoSSR />;
};

export default App;
