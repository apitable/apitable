import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { store } from 'pc/store';
import { WorkdocImage } from './workdoc_image';

interface IExpandWorkdocImage {
  file: any;
  onDelete: () => void;
}

export const expandWorkdocImage = (props: IExpandWorkdocImage) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  const close = () => {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const render = () => {
    root.render(
      <Provider store={store}>
        <ThemeProvider>
          <WorkdocImage onClose={close} {...props} />
        </ThemeProvider>
      </Provider>,
    );
  };

  render();
};