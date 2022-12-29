import { IGlobalContext } from 'interface';
import React, { useState } from 'react';
import { initGlobalContext } from '../store';
import { Provider } from 'react-redux';
import { useUnmount } from 'ahooks';
import { injectStore } from 'core';

export const GlobalContext = React.createContext<IGlobalContext>(null!);

/**
 * Used at the topmost level in a standalone widget environment, equivalent to a complete datasheet runtime environment.
 * There can be only one globalContextProvider globally,
 * which can provide dependency support to multiple widgetStandAloneProvider.
 * When using the GlobalContextProvider,
 * just make sure that the globalContextProvider exists in the parent component above the widgetStandAloneProvider.
 */
export const GlobalContextProvider: React.FC = ({ children }) => {
  const [globalContext] = useState<IGlobalContext>(() => {
    const gtx = initGlobalContext();
    injectStore(gtx.globalStore);
    gtx.resourceService.init();
    return gtx;
  });

  useUnmount(() => {
    globalContext.unSubscribe && globalContext.unSubscribe();
    globalContext.resourceService.destroy();
  });

  return (
    <Provider store={globalContext.globalStore}>
      <GlobalContext.Provider value={globalContext}>
        {children}
      </GlobalContext.Provider>
    </Provider>
  );
};
