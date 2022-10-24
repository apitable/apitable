import { Strings, t } from '@apitable/core';
import { ArgsProps } from 'antd/lib/notification';
import { ButtonPlus } from 'pc/components/common/button_plus/button_plus';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { DASHBOARD_PANEL_ID } from 'pc/components/dashboard_panel';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view';
import React from 'react';
import notification from './notification/index';
import { ICustomNotifyConfig } from './notify.interface';

notification.config({
  placement: 'bottom',
  bottom: 50,
  duration: 3,
  rtl: false,
  closeIcon: null,
});

const commonConfig = {
  icon: null,
  closeIcon: null,
  style: {
    right: 0,
    bottom: 0,
    marginLeft: '40px',
  },
};

/*
 * notify 的出现要在视图区域内，因此需要定位包裹的 dom 元素，但是为了不频繁的获取包裹的 dom，
 * 在这里对数据进行缓存，但是在切换数表，切换空间，因为保存的依旧是原来的 dom 元素，或导致 notify 无法正常显示
 * 因此写了一个 reset 方法重置 dom
 * 如果在后续的开发中发现 notify 调用无反应，可以参考这里
 */
// let container: null | HTMLElement = null;

const createMessage = (message: React.ReactNode, btnText?: string, btnFn?: () => void) => {
  return (
    <>
      {message}
      {
        btnText &&
        <ButtonPlus.Translucent
          onClick={() => { btnFn && btnFn(); }}
          size='small'
          style={{
            marginLeft: '16px',
            height: '20px',
            padding: '0 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            borderColor: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {btnText}
        </ButtonPlus.Translucent>
      }
    </>
  );
};

const close = (key: string) => {
  notification.close(key);
};

const open = (config: ArgsProps & Partial<ICustomNotifyConfig>) => {
  notify.destroy();
  const container = config.dom ||
    document.querySelector(`#${DATASHEET_VIEW_CONTAINER_ID}`) as HTMLElement ||
    document.querySelector(`#${DASHBOARD_PANEL_ID}`) as HTMLElement;

  const { message, btnText, btnFn } = config;
  notification.open(
    {
      ...commonConfig,
      ...config,
      message: createMessage(message, btnText, btnFn),
      getContainer: () => container!,
    },
  );
};

export const notify = {
  close,
  open,
  // 不建议轻易使用该方法，最好能调用 close
  destroy: () => { notification.destroy(); },
  reset: () => {
  },
};

export function notifyWithUndo(msg: string, key: NotifyKey) {
  notify.open({
    message: msg,
    btnText: t(Strings.undo),
    key,
    btnFn() {
      import('pc/common/shortcut_key').then(({ ShortcutActionManager, ShortcutActionName }) => {
        ShortcutActionManager.trigger(ShortcutActionName.Undo);
      });
      notify.close(key);
    },
  });
}
