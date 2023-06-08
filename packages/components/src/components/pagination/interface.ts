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

/**
 * Pagination status interface
 */
export interface IPaginationStatus {
  /**
   * Whether selected or not
   */
  selected?: boolean;

  /**
   * Whether disabled or not
   */
  disabled: boolean;

  /**
   * Whether is the last child
   */
  lastRangeChild?: boolean;
}

/**
 * Pagination inner state interface
 */
export interface IPaginationState {
  /**
   * Current page number
   */
   current: number;

   /**
    * Per page size
    */
   pageSize: number;
 
   /**
    * Total number
    */
   total: number;

   /**
    * Total pages
    */
   pages: number;

}

/**
 * Pagination props interface
 */
export interface IPaginationProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Current page number
   */
  current?: number;

   /**
    * Page Size
    */
  pageSize?: number;
 
   /**
    * Total number
    */
  total: number;

  /**
   * Whether disabled or not
   */
  disabled?: boolean;

  /**
   * Whether show total number or not
   */
  showTotal?: boolean;

  /**
   * Whether show page change UI or not
   */
  showChangeSize?: boolean;

  /**
   * Whether show quick jump UI or not
   */
  showQuickJump?: boolean;

  /**
   * Size or page change callback
   */
  onChange?: (page: number, pageSize: number) => void;

  /**
   * Size change callback
   */
  onPageSizeChange?: (page: number, pageSize: number) => void;
}