import React from 'react';
import { createRoot } from 'react-dom/client';
import { Alert } from './alert';
import { IAlertProps } from './interface';

export interface IAlertFuncBaseProps extends IAlertProps {
  duration?: number; // 自动关闭的延时，单位秒。设为 0 时不自动关闭
  destroyPrev?: boolean;
}

export const showAlert = (config: IAlertFuncBaseProps) => {
  const { duration = 0, destroyPrev = true, ...rest } = config;
  if (destroyPrev) {
    const prev = document.querySelector('.funcAlert');
    prev && prev.parentNode && prev.parentNode.removeChild(prev);
  }
  const div = document.createElement('div');
  div.setAttribute('class', 'funcAlert');
  document.body.appendChild(div);
  const root = createRoot(div);
  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render() {
    setTimeout(() => {
      root.render(
        (
          <Alert {...rest} />
        ),
      );
    });
  }

  const start = () => {
    destroyPrev && destroy();
    render();
    if (duration !== 0) {
      setTimeout(() => {
        destroy();
      }, duration * 1000);
    }
  };
  start();

  return {
    destroy,
  };
};
