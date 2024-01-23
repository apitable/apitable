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

import { useMount, useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { PopupContent } from './popup_content/pc';
import styles from './style.module.less';

const VIEW_MANUAL_SAVE_ALERT = 'VIEW_MANUAL_SAVE_ALERT';

export const ShowViewManualSaveAlert = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_ALERT}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_ALERT);
  document.body.appendChild(container);
  const root = createRoot(container);
  const modalClose = () => {
    root.unmount();
    container.parentElement?.removeChild(container);
  };

  root.render(
    <Provider store={store}>
      <ViewManualSaveAlertContentWithTheme modalClose={modalClose} />
    </Provider>,
  );
};

interface IShowViewManualSaveInPcContentProps {
  modalClose(): void;
}

const ViewManualSaveAlertContentWithTheme: React.FC<React.PropsWithChildren<IShowViewManualSaveInPcContentProps>> = (props) => {
  const cacheTheme = useAppSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <ViewManualSaveAlertContent {...props} />
    </ThemeProvider>
  );
};

const ViewManualSaveAlertContent: React.FC<React.PropsWithChildren<IShowViewManualSaveInPcContentProps>> = (props) => {
  const { modalClose } = props;
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams);
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state, datasheetId));
  const [show, setShow] = useState(false);
  const isViewLock = Boolean(currentView?.lockInfo);

  useMount(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
  });

  useUpdateEffect(() => {
    // Switching datasheets and views requires destroying the component
    modalClose();
  }, [datasheetId, viewId]);

  return (
    <div className={classnames(styles.viewSyncAlert, show && styles.show)}>
      <PopupContent
        autoSave={Boolean(currentView?.autoSave)}
        datasheetId={datasheetId!}
        viewId={viewId!}
        onClose={modalClose}
        contentRef={null}
        isViewLock={isViewLock}
      />
    </div>
  );
};
