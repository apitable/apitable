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

import { Modal } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/modal';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@apitable/components';

interface IPromptInnerProps {
  title: React.ReactNode;
  callbackOrActions: Action[];
  defaultValue: string;
  placeholder?: string;
}

const prefixCls = 'adm-modal';

const PromptInner: React.FC<React.PropsWithChildren<IPromptInnerProps & { close(): void }>> = ({
  title,
  callbackOrActions,
  defaultValue,
  placeholder,
  close,
}) => {
  const [value, setValue] = useState(defaultValue);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    setValue(target.value);
  }

  const content = (
    <div className={`${prefixCls}-input-container`}>
      <div className={`${prefixCls}-input`}>
        <label>
          <input
            type="text"
            defaultValue={defaultValue}
            ref={(input) => input?.focus()}
            onChange={onChange}
            placeholder={placeholder}
            style={{ border: 'none' }}
          />
        </label>
      </div>
    </div>
  );

  function handleConfirm(callback?: (...args: any[]) => void) {
    if (typeof callback !== 'function') {
      return;
    }

    return callback(value);
  }

  const actions = callbackOrActions.map((item) => {
    return {
      text: item.text,
      onClick: () => {
        return handleConfirm(item.onClick);
      },
    };
  });

  const footer = actions.map((button) => {
    const originPress = button.onClick || (() => {});
    button.onClick = () => {
      const res: any = originPress();
      if (res && res.then) {
        res
          .then(() => {
            close();
          })
          .catch(() => {});
      } else {
        close();
      }
    };
    return button;
  });

  return (
    <Modal
      visible
      title={title}
      showCloseButton={false}
      closeOnMaskClick={false}
      actions={footer as any}
      content={<div className={`${prefixCls}-propmt-content`}>{content}</div>}
    />
  );
};

export default function promptFunc(props: IPromptInnerProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function close() {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  root.render(
    <ThemeProvider>
      <PromptInner {...props} close={close} />
    </ThemeProvider>,
  );

  return {
    close,
  };
}
