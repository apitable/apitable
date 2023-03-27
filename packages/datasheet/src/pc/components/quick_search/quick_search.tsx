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

import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '@sentry/nextjs';
import { Provider, useSelector } from 'react-redux';
import { Api, Selectors } from '@apitable/core';
import { ThemeProvider } from '@apitable/components';
import { store } from 'pc/store';
import { SearchBase } from './search_base';
import { ModalWrapper } from './modal_wrapper';
import { EXPAND_SEARCH } from './const';

export function clearExpandModal() {
  const container = document.querySelectorAll(`.${EXPAND_SEARCH}`);
  if (container.length) {
    container.forEach((item) => {
      createRoot(item).unmount();
      item.parentElement!.removeChild(item);
    });
  }
}

const WrapperWithTheme: React.FC<React.PropsWithChildren> = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      {props.children}
    </ThemeProvider>
  );
};

export const expandSearch = () => {
  let container = document.querySelector(`.${EXPAND_SEARCH}`);
  if (container) {
    // createRoot should only create one time;
    return;
  }
  container = document.createElement('div');
  container.classList.add(EXPAND_SEARCH);
  document.body.appendChild(container);
  const root = createRoot(container);

  const onCancel = () => {
    root.unmount();
    clearExpandModal();
  };

  root.render(
    <Provider store={store}>
      <WrapperWithTheme>
        <ModalWrapper onCancel={onCancel}>
          <ErrorBoundary
            onError={() => {
              clearExpandModal();
              setTimeout(() => Api.keepTabbar({}), 500);
            }}
            beforeCapture={scope => {
              scope.setTag('catcher', 'expandSearchCrash');
            }}
          >
            <SearchBase closeSearch={onCancel}/>
          </ErrorBoundary>
        </ModalWrapper>
      </WrapperWithTheme>
    </Provider>,
  );
};

