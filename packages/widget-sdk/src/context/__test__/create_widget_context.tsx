import { ThemeName } from '@apitable/components';
import { IWidgetConfig, IWidgetState } from 'interface';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { GlobalContext } from '../../context/global_context';
import { initGlobalContext } from '../../store';
import { rootReducers } from '../../store/slice/root';
import { WidgetConfigContext, WidgetContext } from '../widget_context';

export function createWidgetStore(widgetState: IWidgetState): Store {
  return createStore(rootReducers, widgetState);
}

export function createWidgetContextWrapper(config: IWidgetConfig, widgetState: IWidgetState, locale = 'zh-CN') {
  const gtx = initGlobalContext();
  const { globalStore, resourceService } = gtx;

  const widgetStore = createWidgetStore(widgetState);

  return ({ children }) => (
    <Provider store={gtx.globalStore}>
      <GlobalContext.Provider value={gtx}>
        <Provider store={widgetStore}>
          <WidgetContext.Provider value={{ id: widgetState.widget!.id, theme: ThemeName.Light, locale, globalStore, resourceService, widgetStore }}>
            <WidgetConfigContext.Provider value={config}>
              {children}
            </WidgetConfigContext.Provider>
          </WidgetContext.Provider>
        </Provider>
      </GlobalContext.Provider>
    </Provider>
  );
}
