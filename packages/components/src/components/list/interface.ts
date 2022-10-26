import React from 'react';
export interface IListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether with border or not
   */
  bordered?: boolean;
  /**
   * Child elements
   */
  children?: React.ReactNode;
  /**
   * List header UI
   */
  header?: React.ReactNode;
  /**
   * List footer UI
   */
  footer?: React.ReactNode;
  /**
   * List data
   */
  data?: Array<string | object | IListItemProps>;
  /**
   * Custom child item UI
   */
  renderItem?: (item: string | IListItemProps, index: number) => React.ReactNode;
}

export interface IListItemProps {
  /**
   * Child element
   */
  children?: React.ReactNode;
  /**
   * Event actions UI
   */
  actions?: React.ReactNode[];
}