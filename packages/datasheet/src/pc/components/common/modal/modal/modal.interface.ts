import { IButtonProps, IButtonType, ITextButtonProps } from '@vikadata/components';
import { ModalFuncProps as AntdModalFuncProps, ModalProps } from 'antd/lib/modal';
import React from 'react';

export interface IModalFuncProps extends Omit<AntdModalFuncProps, 'okButtonProps' | 'cancelButtonProps' | 'okType' | 'type'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  type?: IButtonType | 'success' | undefined;
  icon?: React.ReactElement | null;
  hiddenIcon?: boolean;
  closable?: boolean;
  footer?: React.ReactNode;
  hiddenCancelBtn?: boolean;
}

export interface IModalFuncBaseProps extends IModalFuncProps {
  hiddenCancelBtn?: boolean;
}

export interface IModalProps extends Omit<ModalProps, 'okButtonProps' | 'cancelButtonProps' | 'okType'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  footerBtnCls?: string;
  hiddenCancelBtn?: boolean;
}

export interface IModalReturn {
  destroy: () => void;
}
