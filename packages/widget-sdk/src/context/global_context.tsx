import { IGlobalContext } from 'interface';
import React, { useState } from 'react';
import { initGlobalContext } from '../store';
import { Provider } from 'react-redux';
import { useUnmount } from 'ahooks';
import { injectStore } from 'core';

export const GlobalContext = React.createContext<IGlobalContext>(null!);

/**
 * 在独立小程序环境中最上层使用，相当于一个完整的数表运行环境
 * 全局只能有一个 globalContextProvider，可以给多个 widgetStandAloneProvider 提供依赖支持
 * 使用时只要确保 widgetStandAloneProvider 的上层父组件存在 globalContextProvider 即可
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
