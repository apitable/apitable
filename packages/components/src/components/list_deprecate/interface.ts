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

import { IUseListenTriggerInfo } from 'helper';
import { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface IListDeprecateProps {

  /**
   * Child element
   */
  children: ReactElement[];

  /**
   * click handler
   */
  onClick(e: React.MouseEvent | null, index: number): void

  /**
   * Tips when data is empty
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * Footer components
   */
  footerComponent?: () => ReactNode;

  className?: string;
  style?: React.CSSProperties

  /**
   * The position of the item currently being focused
   */
  activeIndex?: number

  searchProps?: ISearchProps

  triggerInfo?: IUseListenTriggerInfo;

  autoHeight?: boolean;
}

export interface IListItemProps extends HTMLAttributes<HTMLDivElement> {

  /**
   * Current option index
   */
  currentIndex: number;
  setRef?: (node: (HTMLElement | null)) => void;
  /**
   * Wrapper component
   */
  wrapperComponent?(children: ReactNode): ReactNode
  active?:boolean;
  selected?:boolean;
  disabled?: boolean;
}

export interface ISearchProps {
  /**
   *  Input reference
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties

  /**
   * Input placeholder
   */
  placeholder?: string

  /**
   * @description input enter event callback
   * @param {() => void} clearKeyword is the processing function passed in from the component, 
   * where you can process some operations inside the component
   */
  onInputEnter?(clearKeyword: () => void): void

  /**
   * @description Search input callback
   * @param {React.ChangeEvent} e
   * @param {string} keyword
   */
  onSearchChange?(e: React.ChangeEvent, keyword: string): void
}
