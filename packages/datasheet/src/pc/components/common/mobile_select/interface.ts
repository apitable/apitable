import * as React from 'react';
import { SelectProps } from 'antd/lib/select';

export interface IMobileSelectProps extends SelectProps<any> {
  /**
   * @description 关闭的回调处理
   */
  onClose?: () => void;

  /**
   * @description 选项的内容
   */
  optionData?: IMobileOptionItem[];

  /**
   * @description 手机端选项的标题
   */
  title?: string;

  triggerStyle?: React.CSSProperties;

  /**
   * @description 手机端选择器的高度
   */
  height?: number | string;

  /**
   * @description 自定义触发器的内容
   */
  triggerComponent?: React.ReactNode;

  /**
   * @description 自定义弹出卡片的内容
   * @param {any} setVisible
   * @returns {React.ReactNode}
   */
  renderList?: ({ setVisible }) => React.ReactNode
}

interface IMobileOptionItem {
  /**
   * @description 列表中要显示的标签，可以是 string ，也可以是一个节点
   */
  label: React.ReactNode;

  /**
   * @description 选项对应的值
   */
  value: any;

  /**
   * @description 选项的前置 icon
   */
  prefixIcon?: React.ReactNode;

  /**
   * @description 选项的后置 icon
   */
  suffixIcon?: React.ReactNode;

  /**
   * @description 当前选项是否可以操作
   */
  disabled?: boolean;
}
