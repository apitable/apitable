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

import { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface ICommonListProps {
  /**
   * @description Each option wrapped component, which is a static component bound to a CommonList component
   * @type {ReactElement[]}
   */
  children: ReactElement[];

  /**
   * @description Click on the processing function for each option
   * @param {(React.MouseEvent | null)} e
   * @param {number} index
   */
  onClickItem(e: React.MouseEvent | null, index: number): void;

  /**
   * @description input Callback function for pressing the Enter key
   * @param {() => void} clearKeyword Handler function passed inside the component, where you can handle some internal component operations
   * For example, clear the data in the input box
   */
  onInputEnter?(clearKeyword: () => void): void;

  /**
   * @description A reference bound to the Input component to focus
   * @type {React.RefObject<HTMLInputElement>}
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * @description Tips for no data
   */
  noDataTip?: string | (() => ReactNode);

  /**
   * @description Tips for empty search results
   */
  noSearchResult?: string | (() => ReactNode);

  /**
   * @description Components in the bottom area of the component
   */
  footerComponent?: () => ReactNode;

  /**
   * @description Already selected values
   * @type {string}
   */
  value?: (string | number)[] | null;

  className?: string;
  style?: React.CSSProperties;

  /**
   * @description Prompt for input
   * @type {string}
   */
  inputPlaceHolder?: string;

  /**
   * @description Callback after inputting content
   * @param {React.ChangeEvent} e
   */
  onSearchChange?(e: React.ChangeEvent | null, keyword: string): void;

  /**
   * @description Whether to display the input component
   * @type {boolean}
   */
  showInput?: boolean;

  /**
   * @description Monitoring sources for re-rendering
   * @type {string}
   */
  monitorId?: string;

  /**
   * @description Originally, this parameter was controlled internally by the component, but in draft, you need to maintain the editor's own index,
   * so you need to pass it in like the component's internal
   * @type {number}
   */
  activeIndex?: number;

  /**
   * @description Customize the style of the input box
   * @type {React.CSSProperties}
   */
  inputStyle?: React.CSSProperties;

  getListContainer?: (children: React.ReactNode) => React.ReactNode;

  onInputClear?: () => void;

  isLoadingData?: boolean;
}

export interface IOptionItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @description Subscript of current option
   * @type {number}
   */
  currentIndex: number;

  /**
   * @description Unique feature of the current option, used to determine if it is selected
   * @type {string}
   */
  id: string;

  /**
   * @description Whether it is selected or not, this will be determined inside the component, and can be passed in externally, but will be overridden
   * @type {boolean}
   */
  isChecked?: boolean;

  /**
   * @description In the option sorting will need to wrap a layer of other components, but for internal bad handling,
   * so you can pass in a wrapped function through this property
   * @param {*} children
   * @returns {ReactNode}
   */
  wrapperComponent?(children: ReactElement): ReactNode;

  disabled?: boolean;
}
