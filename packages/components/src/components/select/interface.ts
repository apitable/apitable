/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
   * Whether disabled or not
   */
  disabledTip?: string;

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

  popupStyle?: React.CSSProperties;
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
