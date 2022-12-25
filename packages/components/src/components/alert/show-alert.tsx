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

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Alert } from './alert';
import { IAlertProps } from './interface';

export interface IAlertFuncBaseProps extends IAlertProps {
  /*
   * Delay closing, in seconds. Do not close automatically when set to 0
   */
  duration?: number;
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
