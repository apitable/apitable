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

import { ArgsProps } from 'antd/lib/notification';
import React from 'react';
import { Strings, t } from '@apitable/core';
import { ButtonPlus } from 'pc/components/common/button_plus/button_plus';
import { NotifyKey, ICustomNotifyConfig } from 'pc/components/common/notify/notify.interface';
import { DASHBOARD_PANEL_ID } from 'pc/components/dashboard_panel/dashboard/id';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view/id';
import notification from './notification/index';

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
 * The notify has to appear within the view area, so the wrapped dom element needs to be located,
 * but in order to not fetch the wrapped dom too often, the
 * The data is cached here, but when switching the datasheet, the space is switched, as the original dom element is still stored,
 * or the notify is not displayed properly
 * So a reset method was written to reset the dom
 * If you find that the notify call does not respond in subsequent development, you can refer here
 */
// let container: null | HTMLElement = null;

const createMessage = (message: React.ReactNode, btnText?: string, btnFn?: () => void) => {
  return (
    <>
      {message}
      {btnText && (
        <ButtonPlus.Translucent
          onClick={() => {
            btnFn && btnFn();
          }}
          size="small"
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
      )}
    </>
  );
};

const close = (key: string) => {
  notification.close(key);
};

const open = (config: ArgsProps & Partial<ICustomNotifyConfig>) => {
  notify.destroy();
  const container =
    config.dom ||
    (document.querySelector(`#${DATASHEET_VIEW_CONTAINER_ID}`) as HTMLElement) ||
    (document.querySelector(`#${DASHBOARD_PANEL_ID}`) as HTMLElement);

  const { message, btnText, btnFn } = config;
  notification.open({
    ...commonConfig,
    ...config,
    message: createMessage(message, btnText, btnFn),
    getContainer: () => container!,
  });
};

export const notify = {
  close,
  open,
  // It is not recommended to use this method lightly and it is better to call close
  destroy: () => {
    notification.destroy();
  },
  reset: () => {},
};

export function notifyWithUndo(msg: string, key: NotifyKey) {
  notify.open({
    message: msg,
    btnText: t(Strings.undo),
    key,
    btnFn() {
      import('modules/shared/shortcut_key').then(({ ShortcutActionManager, ShortcutActionName }) =>
        ShortcutActionManager.trigger(ShortcutActionName.Undo),
      );
      notify.close(key);
    },
  });
}
