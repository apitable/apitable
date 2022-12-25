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
import { IFieldRoTransformOptions, IFieldValue, IFieldVoTransformOptions } from 'shared/interfaces';

/**
 * Field conversion interface
 */
export interface IFieldTransformInterface {
  /**
   * Convert to a standard value for writing to the database
   *
   * @param fieldValue
   * @param field       Field Propertie
   * @param options     All field attributes and spaceId
   */
  roTransform(fieldValue: IFieldValue, field: IField, options: IFieldRoTransformOptions): ICellValue | Promise<ICellValue>;

  /**
   * api return convert
   *
   * @param fieldValue
   * @param field      Field Propertie
   * @param options    All field attributes and corresponding records, global member map to avoid circular search
   */
  voTransform(fieldValue: IFieldValue, field: IField, options?: IFieldVoTransformOptions): IFieldValue | Promise<IFieldValue> | undefined;
}
