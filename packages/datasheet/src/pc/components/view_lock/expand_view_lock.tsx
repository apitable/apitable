import { ThemeProvider } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { ViewLock } from 'pc/components/view_lock/view_lock';
import { store } from 'pc/store';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';

export const expandViewLock = (viewId: string, unlockHandle?: () => void) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  const ViewLockWithTheme = (props) => {
    const cacheTheme = useSelector(Selectors.getTheme);
    return (
      <ThemeProvider theme={cacheTheme}>
        <ViewLock {...props} />
      </ThemeProvider>
    );
  };

  root.render((
    <Provider store={store}>
      <ViewLockWithTheme
        viewId={viewId}
        onModalClose={onModalClose}
        unlockHandle={unlockHandle}
      />
    </Provider>
  ));
};
