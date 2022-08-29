import { Strings, t } from '@vikadata/core';
import { Modal as AntdMobileModal } from 'antd-mobile';
import { colorVars } from '@vikadata/components';
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

  return AntdMobileModal.alert(
    title,
    content,
    [
      { text: cancelText || t(Strings.cancel), onPress: onCancel },
      { text: okText || t(Strings.confirm), onPress: onOk, style: { color: colorVars.primaryColor }},
    ]
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
      { text: okText || cancelText || t(Strings.cancel), onPress: onCancel },
      { text: t(Strings.confirm), onPress: onOk, style: { color: `${colorVars.primaryColor} !important` }},
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

  return AntdMobileModal.alert(
    <span style={{ color: colorVars.errorColor }}>{title}</span>,
    content,
    [
      { text: cancelText || t(Strings.cancel), onPress: onCancel },
      { text: okText || t(Strings.confirm), onPress: onOk, style: { color: colorVars.errorColor }},
    ]
  );
}

export const Modal: IModal = {
  confirm,
  warning,
  prompt,
};