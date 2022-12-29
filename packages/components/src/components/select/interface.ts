import React, { ReactNode } from 'react';

export type ISelectValue = string | number;

export interface ISelectProps {
  /**
   * Selected item value
   */
  value?: ISelectValue;

  /**
   * select action callback
   */
  onSelected?: (option: IOption, index: number) => void;

  /**
   * Select options
   */
  options?: IOption[];

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Prefix icon component
   */
  prefixIcon?: React.ReactNode;

  /**
   * Suffix icon component
   */
  suffixIcon?: React.ReactNode;

  /**
   * Whether the select should be the same width as the trigger
   */
  dropdownMatchSelectWidth?: boolean;

  /**
   * Trigger inline styles
   */
  triggerStyle?: React.CSSProperties;

  /**
   * Trigger class name
   */
  triggerCls?: string;

  /**
   * Custom select list class name
   */
  listCls?: string;

  /**
   * Custom select list inline styles
   */
  listStyle?: React.CSSProperties;

  /**
   * Whether should open search function
   */
  openSearch?: boolean;

  /**
   * After the search is enabled, the placeholder of select search input
   */
  searchPlaceholder?: string;

  /**
   * After the search is enabled, the search keyword inline styles
   */
  highlightStyle?: React.CSSProperties

  /**
   * Prompt when data is empty
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * Whether to hide the selected items
   */
  hideSelectedOption?: boolean;

  /**
   * Custom drop down components
   */
  dropdownRender?: React.ReactNode;

  /**
   * Whether disabled or not
   */
  disabled?: boolean;

  /**
   * Customize the text portion of the value in the trigger
   */
  renderValue?: (option: IOption) => string;

  /**
   * Set maximum width
   * When dropdownMatchSelectWidth is true, the list will be stretched according to the width of the content.
   * However, if the content is too long, the list will also become very wide
   */
  maxListWidth?: number;

  /**
   * When visiable or not
   */
  defaultVisible?: boolean;

  /**
   * Whether hidden arrow or not
   */
  hiddenArrow?: boolean;

  /**
   * Show trigger text
   */
  triggerLabel?: string | React.ReactNode;
}

export interface IOption {
  /**
   * Selected option value
   * @type {(string | number)}
   */
  value: ISelectValue;

  /**
   * Select option show text
   * @type {string}
   */
  label: string;

  /**
   * Select option prefix icon
   * @type {JSX.Element}
   */
  prefixIcon?: React.ReactNode;

  /**
   * Select option suffix icon
   * @type {JSX.Element}
   */
  suffixIcon?: React.ReactNode;

  /**
   * Whether disabled option or not
   * @type {boolean}
   */
  disabled?: boolean;

  /**
   * Prompt for disabled option
   * @type {string}
   */
  disabledTip?: string;
}

export interface ISelectOption {
  option: Pick<IOption, 'value' | 'disabled' | 'disabledTip'>;
  currentIndex: number;
  className?: string;
  style?: React.CSSProperties;
}
