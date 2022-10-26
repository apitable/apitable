import { ITextButtonProps } from 'components';
import { IButtonProps } from 'components/button';
import React from 'react';

export interface IModalProps {
  className?: string;

  /**
   * Whether visible or hidden
   */
  visible?: boolean;

  /**
   * Modal title
   */
  title?: React.ReactNode | string;

  /**
   * Whether show close button or not
   */
  closable?: boolean;

  /**
   * Use custom close icon
   */
  closeIcon?: React.ReactNode;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Modal footer
   */
  footer?: React.ReactNode;

  /**
   * Modal body inline styles
   */
  bodyStyle?: React.CSSProperties;

  /**
   * confirm click callback
   */
  onOk?: () => void;

  /**
   * cancel click callback
   */
  onCancel?: () => void;

  /**
   * confirm button text
   */
  okText?: string;

  /**
   * cancel button text
   */
  cancelText?: string;

  /**
   * Select a mount node
   * @default document.body
   */
  getContainer?: HTMLElement | (() => HTMLElement);

  /** Whether modal mask can be closed
   * @default true
   */
  maskClosable?: boolean;

  /**
   * Asynchronous submit loading
   * @default false
   */
  confirmLoading?: boolean;

  /**
   * Center Vertically
   * @default false
   */
  centered?: boolean;

  /**
   * Modal width in pixels
   * @default 520px
   */
  width?: number | string;

  /**
   * z-index of modal
   * @default 1000
   */
  zIndex?: number;

  draggable?: boolean;

  modalRender?: (modal: any) => any;

  /**
   * @default true
   */
  destroyOnClose?: boolean;

  okButtonProps?: IButtonProps;

  cancelButtonProps?: ITextButtonProps;
}

export interface IModalFuncProps {
  className?: string;
  title?: React.ReactNode;
  content: React.ReactNode | string;
  onOk?: () => void;
  onCancel?: () => void;
  closable?: boolean;
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  width?: number | string;
  type?: 'confirm' | 'warning' | 'danger' | 'info' | 'error' | 'success';
  footer?: React.ReactNode;
  maskClosable?: boolean;
  zIndex?: number;
}

export interface IModalRef {
  close(): void;
  update?(config: IModalFuncProps): IModalRef;
}

export type IModalFunc = (props: IModalFuncProps) => IModalRef;

export interface IModalFuncs {
  confirm: IModalFunc;
  warning: IModalFunc;
  danger: IModalFunc;
  error: IModalFunc;
  success: IModalFunc;
  info: IModalFunc;
}
