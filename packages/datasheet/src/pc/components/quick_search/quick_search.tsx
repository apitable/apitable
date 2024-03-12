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

import { ErrorBoundary } from '@sentry/nextjs';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { Api, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { EXPAND_SEARCH } from './const';
import { ModalWrapper } from './modal_wrapper';
import { SearchBase } from './search_base';

export function clearExpandModal() {
  const container = document.querySelectorAll(`.${EXPAND_SEARCH}`);
  if (container.length) {
    container.forEach((item) => {
      createRoot(item).unmount();
      item.parentElement!.removeChild(item);
    });
  }
}

const WrapperWithTheme: React.FC<React.PropsWithChildren<any>> = (props) => {
  const cacheTheme = useAppSelector(Selectors.getTheme);
  return <ThemeProvider theme={cacheTheme}>{props.children}</ThemeProvider>;
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
            beforeCapture={(scope) => {
              scope.setTag('catcher', 'expandSearchCrash');
            }}
          >
            <SearchBase closeSearch={onCancel} />
          </ErrorBoundary>
        </ModalWrapper>
      </WrapperWithTheme>
    </Provider>,
  );
};
