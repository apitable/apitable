import { ITextButtonProps } from 'components';
import { IButtonProps } from 'components/button';
import React from 'react';

export interface IModalProps {
  className?: string;

  /**
   * 控制组件显示隐藏
   * @default true
   */
  visible?: boolean;

  /**
   * 标题, 可不传, 如果想要完全不渲染标题区域可以传 null
   */
  title?: React.ReactNode | string;

  /**
   * @default true
   * 控制关闭按钮的显示
   */
  closable?: boolean;

  /**
   * 不传默认提供关闭 icon,
   */
  closeIcon?: React.ReactNode;

  /**
   * 正文主体
   */
  children: React.ReactNode;

  /**
   * 页脚区域, 默认给定 2 个操作按钮, 可自定义页脚, 如果想要完全不展示, 可传 null
   */
  footer?: React.ReactNode;

  /**
   * 正文区域样式
   */
  bodyStyle?: React.CSSProperties;

  /**
   * 确定按钮点击事件回调
   * @default noop
   */
  onOk?: () => void;

  /**
   * 取消按钮点击事件回调
   * @default noop
   */
  onCancel?: () => void;

  /**
   * 确定按钮文本
   * @default 确定
   */
  okText?: string;

  /**
   * 取消按钮文本
   * @default 取消
   */
  cancelText?: string;

  /**
   * 可选择一个挂载节点
   * @default document.body
   */
  getContainer?: HTMLElement | (() => HTMLElement);

  /** 点击蒙层能否关闭
   * @default true
   */
  maskClosable?: boolean;

  /**
   * 确定行为的当前状态
   * @default false
   */
  confirmLoading?: boolean;

  /**
   * 垂直居中
   * @default false
   */
  centered?: boolean;

  /**
   * 窗体宽度
   * @default 520
   */
  width?: number | string;

  /**
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
