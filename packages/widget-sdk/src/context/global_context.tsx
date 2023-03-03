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

import { IGlobalContext } from 'interface';
import React, { useState } from 'react';
import { initGlobalContext } from '../store';
import { Provider } from 'react-redux';
import { useUnmount } from 'ahooks';
import { injectStore } from 'core';

const _Provider: any = Provider;

export const GlobalContext = React.createContext<IGlobalContext>(null!);

/**
 * Used at the topmost level in a standalone widget environment, equivalent to a complete datasheet runtime environment.
 * There can be only one globalContextProvider globally,
 * which can provide dependency support to multiple widgetStandAloneProvider.
 * When using the GlobalContextProvider,
 * just make sure that the globalContextProvider exists in the parent component above the widgetStandAloneProvider.
 */
export const GlobalContextProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
    <_Provider store={globalContext.globalStore}>
      <GlobalContext.Provider value={globalContext}>
        {children}
      </GlobalContext.Provider>
    </_Provider>
  );
};
