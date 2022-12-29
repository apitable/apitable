import * as React from 'react';
import { SelectProps } from 'antd/lib/select';

export interface IMobileSelectProps extends SelectProps<any> {
  /**
   * @description Callback handling for closures
   */
  onClose?: () => void;

  /**
   * @description Content of the options
   */
  optionData?: IMobileOptionItem[];

  /**
   * @description Title of the mobile option
   */
  title?: string;

  triggerStyle?: React.CSSProperties;

  /**
   * @description Height of selector on mobile
   */
  height?: number | string;

  /**
   * @description Customising the content of triggers
   */
  triggerComponent?: React.ReactNode;

  /**
   * @description Customise the content of the pop-up card
   * @param {any} setVisible
   * @returns {React.ReactNode}
   */
  renderList?: ({ setVisible }) => React.ReactNode
}

interface IMobileOptionItem {
  /**
   * @description The label to be displayed in the list, either as a string or as a node
   */
  label: React.ReactNode;

  /**
   * @description The value corresponding to the option
   */
  value: any;

  /**
   * @description Front icon of the option
   */
  prefixIcon?: React.ReactNode;

  /**
   * @description Back icon for options
   */
  suffixIcon?: React.ReactNode;

  /**
   * @description Is the current option operable
   */
  disabled?: boolean;
}
