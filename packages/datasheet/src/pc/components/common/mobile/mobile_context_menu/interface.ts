import * as React from 'react';

export interface IMobileContextMenuProps {
  visible: boolean;

  /**
   * @description 移动端的 contextMenu 会有一个标题
   */
  title: React.ReactNode;

  /**
   * @description 需要显示的数据
   */
  data: any;

  /**
   * @description 关闭的回调
   */
  onClose: () => void;

  /**
   * @description hidden 或者 disabled 可能是函数，这里可以定制化一些参数
   */
  params?: {
    [key: string]: any
  }

  /**
   * @description 显示高度
   * @default 90%（手机屏幕高度的 90%）
   */
  height?: string;
}
