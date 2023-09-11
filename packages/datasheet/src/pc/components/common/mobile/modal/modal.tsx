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

import { Modal as AntdMobileModal } from 'antd-mobile';
import * as React from 'react';
import { colorVars } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import promptFunc from './prompt';

export interface IModalFuncProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  onOk?: (...args: any[]) => void | Promise<any>;
  onCancel?: (...args: any[]) => void | Promise<any>;
  okText?: string;
  cancelText?: string;
  placeholder?: string;
}

export interface IModal {
  confirm: (props: IModalFuncProps) => { close: () => void };
  warning: (props: IModalFuncProps) => { close: () => void };
  prompt: (props: IModalFuncProps & { defaultValue: string }) => { close: () => void };
}

export function confirm(props: IModalFuncProps) {
  const { title, content, onOk, onCancel, okText, cancelText } = props;

  return AntdMobileModal.show({
    title,
    content,
    closeOnAction: true,
    actions: [
      { text: cancelText || t(Strings.cancel), onClick: onCancel, key: cancelText || t(Strings.cancel) },
      { text: okText || t(Strings.confirm), onClick: onOk, style: { color: colorVars.primaryColor }, key: okText || t(Strings.confirm) },
    ],
  });
}

export function prompt(props: IModalFuncProps & { defaultValue: string }) {
  const { title, onOk, onCancel, placeholder, defaultValue, okText, cancelText } = props;

  return promptFunc({
    title,
    callbackOrActions: [
      { text: okText || cancelText || t(Strings.cancel), onClick: onCancel, key: okText || cancelText || t(Strings.cancel) },
      { text: t(Strings.confirm), onClick: onOk, style: { color: `${colorVars.primaryColor} !important` }, key: t(Strings.confirm) },
    ],
    defaultValue,
    placeholder,
  });
}

export function warning(props: IModalFuncProps) {
  const { title, content, onOk, onCancel, okText, cancelText } = props;

  return AntdMobileModal.show({
    title: <span style={{ color: colorVars.errorColor }}>{title}</span>,
    content,
    closeOnAction: true,
    actions: [
      { text: cancelText || t(Strings.cancel), onClick: onCancel, key: cancelText || t(Strings.cancel) },
      { text: okText || t(Strings.confirm), onClick: onOk, style: { color: colorVars.errorColor }, key: okText || t(Strings.confirm) },
    ],
  });
}

export const Modal: IModal = {
  confirm,
  warning,
  prompt,
};
