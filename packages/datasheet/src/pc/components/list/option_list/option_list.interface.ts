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

import { ISelectFieldOption, IFieldProperty, ICollaCommandExecuteResult } from '@apitable/core';
import { IListBase } from '../list.interface';

export interface IOptionListProps extends IListBase<string[], ISelectFieldOption[]> {
  /**
   * @description The data used for the drop-down list tree is the same data structure as the data stored in the column headers
   * @type {ISelectFieldOption[]}
   */
  listData: ISelectFieldOption[];

  /**
   * @description The operation related to dragging, currently after the cell and expand the card has the function,
   * you can basically use this to determine whether the cell
   * @type {({
   *     draggingId: string | undefined
   *     setDraggingId: any
   *     afterDrag (trulyOldIndex, trulyNewIndex): void
   *   })}
   */
  dragOption?: {
    draggingId: string | undefined;
    setDraggingId: any;
    afterDrag(trulyOldIndex: any, trulyNewIndex: any): void;
  };

  /**
   * @description Set the properties of the column headers
   */
  setCurrentField?: (getNewField: (newField: IFieldProperty) => IFieldProperty) => ICollaCommandExecuteResult<{}>;

  /**
   * @description Add a new option
   * @param {string} keyword
   * @param {*} cb
   */
  onAddHandle?(keyword: string, cb: any): void;

  /**
   * @description Capture the internal Input instance of the component to facilitate triggering focus
   * @type {React.RefObject<HTMLInputElement>}
   */
  inputRef: React.RefObject<HTMLInputElement>;

  datasheetId?: string;
  placeholder?: string;
}
