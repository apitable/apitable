import { ReactNode } from 'react';

export interface ITag {
  /**
   * 类名
   */
  className?: string;

  /**
   * 标签颜色
   */
  color?: string;

  /**
   * 标签描边颜色
   */
  outlineColor?: string;

  /**
   * 图标
   */
  icon?: ReactNode | string;

  /**
   * 是否可关闭
   */
  closable?: boolean;

  /**
   * 关闭回调
   */
  onClose?: () => void;

  /**
   * 填充内容
   */
  children: ReactNode;
}