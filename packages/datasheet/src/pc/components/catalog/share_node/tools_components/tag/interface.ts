import React, { ReactNode } from 'react';

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
   * 以 html 形式插入 children
   */
  childrenInDangerHTML?: boolean;

  /**
   * 关闭回调
   */
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * 填充内容
   */
  children: ReactNode;
}