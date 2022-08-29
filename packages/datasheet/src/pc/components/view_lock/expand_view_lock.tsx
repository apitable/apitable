import { Selectors } from '@vikadata/core';
import { ViewLock } from 'pc/components/view_lock/view_lock';
import { store } from 'pc/store';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from '@vikadata/components';

export const expandViewLock = (viewId: string, unlockHandle?: () => void) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
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

  ReactDOM.render((
    <Provider store={store}>
      <ViewLockWithTheme 
        viewId={viewId}
        onModalClose={onModalClose}
        unlockHandle={unlockHandle} 
      />
    </Provider>
  ),
  container,
  );
};
