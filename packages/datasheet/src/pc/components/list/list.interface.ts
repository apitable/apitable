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

export interface IListBase<T, L> {
  /**
   * @description Existing data
   * For cell, it is cellValue
   * For filter, this is filterValue
   * @type {(IUnitIds | null)}
   */
  existValues: T;

  /**
   * @description Click callbacks for each option in the dropdown box
   * @param {T} value
   */
  onClickItem(value: T): void;

  /**
   * @description Mark whether the current mode is single-select or multi-select
   * @type {boolean}
   */
  multiMode: boolean;

  /**
   * @description The data to be displayed in the drop-down list, if not passed in, will use the data stored in the memberStash class
   * @type {L}
   */
  listData?: L;

  /**
   * @description Special properties that make it easy for internal components to know if they need to be updated
   * @type {string}
   */
  monitorId?: string;

  className?: string;
}
