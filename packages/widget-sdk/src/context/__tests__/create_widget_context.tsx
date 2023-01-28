/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  return ({ children }: { children: any }) => (
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
