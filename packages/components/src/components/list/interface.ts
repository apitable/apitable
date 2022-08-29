import React from 'react';
export interface IListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否带边框样式 */
  bordered?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
  /** 列表头部 UI */
  header?: React.ReactNode;
  /** 列表尾部 UI */
  footer?: React.ReactNode;
  /** 列表数据 */
  data?: Array<string | object | IListItemProps>;
  /** 自定义列表子元素 UI */
  renderItem?: (item: string | IListItemProps, index: number) => React.ReactNode;
}

export interface IListItemProps {
  /** 子元素 */
  children?: React.ReactNode;
  /** 操作集合 */
  actions?: React.ReactNode[];
}