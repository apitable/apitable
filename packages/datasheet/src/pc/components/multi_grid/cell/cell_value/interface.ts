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

import { ICellValue, IField } from '@apitable/core';

export interface ICellComponentProps {
  field: IField;

  /**
   * Note that the readonly here checks for more than just having access to the current count table, e.g.
   * For calculated fields, there are editing permissions for tables, but not for cells
   * For related fields, it is possible to have permissions on this table, but not on the other table
   * So the readonly here is the result of a comprehensive judgment, not just a question of this table's permissions
   */
  readonly?: boolean;

  cellValue: ICellValue;

  isActive?: boolean;

  className?: string;

  /**
   * Provides the ability to edit only the cells within the component.
   * When the cell content is changed, the onChange callback function is called, passing in the changed value,
   * and the external component handles the command execution matter.
   */
  onChange?: (value: ICellValue) => void;

  /**
   * The component controls itself internally how to start editing.
   * When called, the Editor component corresponding to the cell will receive the editing change parameter.
   */
  toggleEdit?: () => Promise<void>;

  showAlarm?: boolean;

  recordId?: string;

  /**
   * Why is there no recordId?
   * When rendering cell components, you should only focus on what is being rendered.
   * It has nothing to do with the exact position of the cell and its id.
   * If the recordId/fieldId is used when writing the cell rendering component, it means that there is a problem with the logic design
   */
}
