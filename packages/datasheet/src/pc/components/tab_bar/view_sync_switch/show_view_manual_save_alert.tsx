import { useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.less';
import { Selectors } from '@vikadata/core';
import { store } from 'pc/store';
import { Provider, useSelector } from 'react-redux';
import { PopupContent } from 'pc/components/tab_bar/view_sync_switch/popup_content';
import { useMount, useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import { ThemeProvider } from '@vikadata/components';

const VIEW_MANUAL_SAVE_ALERT = 'VIEW_MANUAL_SAVE_ALERT';

export const ShowViewManualSaveAlert = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_ALERT}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_ALERT);
  document.body.appendChild(container);

  const modalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement?.removeChild(container);
  };

  ReactDOM.render((
    <Provider store={store}>
      <ViewManualSaveAlertContentWithTheme modalClose={modalClose} />
    </Provider>
  ),
  container,
  );
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
