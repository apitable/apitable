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
import { store } from '../../../store';
import { MobilePopupContent } from './popup_content/mobile';

const VIEW_MANUAL_SAVE_TIP = 'VIEW_MANUAL_SAVE_TIP';
const DOM_IDDATASHEET_VIEW_CONTAINER_ID = 'DATASHEET_VIEW_CONTAINER_ID';

export const showViewManualSaveInMobile = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_TIP}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_TIP);
  document.body.appendChild(container);
  const root = createRoot(container);

  const datasheetContainer = document.body.querySelector(`#${DOM_IDDATASHEET_VIEW_CONTAINER_ID}`) as HTMLElement;

  if (datasheetContainer) {
    datasheetContainer.style.marginTop = '40px';
  }
  const modalClose = () => {
    root.unmount();
    if (datasheetContainer) {
      datasheetContainer.style.marginTop = '0px';
    }
    container.parentElement?.removeChild(container);
  };

  root.render(
    <Provider store={store}>
      <MobilePopupContent onClose={modalClose} />
    </Provider>,
  );
};
