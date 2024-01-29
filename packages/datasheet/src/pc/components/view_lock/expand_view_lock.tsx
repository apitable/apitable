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
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { ViewLock } from 'pc/components/view_lock/view_lock';
import { store } from 'pc/store';

import { useAppSelector } from 'pc/store/react-redux';

export const expandViewLock = (viewId: string, unlockHandle?: () => void) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  const ViewLockWithTheme = (props: any) => {
    const cacheTheme = useAppSelector(Selectors.getTheme);
    return (
      <ThemeProvider theme={cacheTheme}>
        <ViewLock {...props} />
      </ThemeProvider>
    );
  };

  root.render(
    <Provider store={store}>
      <ViewLockWithTheme viewId={viewId} onModalClose={onModalClose} unlockHandle={unlockHandle} />
    </Provider>,
  );
};
