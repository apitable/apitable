import { ThemeProvider } from '@vikadata/components';
import { Selectors } from '@apitable/core';
import { useMount, useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import { PopupContent } from 'pc/components/tab_bar/view_sync_switch/popup_content';
import { store } from 'pc/store';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
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

  root.render((
    <Provider store={store}>
      <ViewManualSaveAlertContentWithTheme modalClose={modalClose} />
    </Provider>
  ));
};

interface IShowViewManualSaveInPcContentProps {
  modalClose(): void;
}

const ViewManualSaveAlertContentWithTheme = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <ViewManualSaveAlertContent {...props} />
    </ThemeProvider>
  );
};

const ViewManualSaveAlertContent: React.FC<IShowViewManualSaveInPcContentProps> = (props) => {
  const { modalClose } = props;
  const { datasheetId, viewId } = useSelector(state => state.pageParams);
  const currentView = useSelector(state => Selectors.getCurrentView(state, datasheetId));
  const [show, setShow] = useState(false);
  const isViewLock = Boolean(currentView?.lockInfo);

  useMount(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
  });

  useUpdateEffect(() => {
    // 切换数表和视图需要销毁该组件
    modalClose();
  }, [datasheetId, viewId]);

  return <div className={classnames(styles.viewSyncAlert, show && styles.show)}>
    <PopupContent
      autoSave={Boolean(currentView?.autoSave)}
      datasheetId={datasheetId!}
      viewId={viewId!}
      onClose={modalClose}
      contentRef={null}
      isViewLock={isViewLock}
    />
  </div>;
};
