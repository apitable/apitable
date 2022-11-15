import { colorVars } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Modal as AntdMobileModal } from 'antd-mobile';
import * as React from 'react';
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
  const {
    title,
    content,
    onOk,
    onCancel,
    okText,
    cancelText,
  } = props;

  return AntdMobileModal.show(
    {
      title,
      content,
      actions: [
        { text: cancelText || t(Strings.cancel), onClick: onCancel, key: cancelText || t(Strings.cancel) },
        { text: okText || t(Strings.confirm), onClick: onOk, style: { color: colorVars.primaryColor }, key: okText || t(Strings.confirm) },
      ],
    },
  );
}

export function prompt(props: IModalFuncProps & { defaultValue: string }) {
  const {
    title,
    onOk,
    onCancel,
    placeholder,
    defaultValue,
    okText,
    cancelText,
  } = props;

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
  const {
    title,
    content,
    onOk,
    onCancel,
    okText,
    cancelText,
  } = props;

  return AntdMobileModal.show(
    {
      title: <span style={{ color: colorVars.errorColor }}>{title}</span>,
      content,
      actions: [
        { text: cancelText || t(Strings.cancel), onClick: onCancel, key: cancelText || t(Strings.cancel) },
        { text: okText || t(Strings.confirm), onClick: onOk, style: { color: colorVars.errorColor }, key: okText || t(Strings.confirm) },
      ],
    },
  );
}

export const Modal: IModal = {
  confirm,
  warning,
  prompt,
};

