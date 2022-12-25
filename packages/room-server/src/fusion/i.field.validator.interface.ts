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

import { IField } from '@apitable/core';
import { ApiTipId } from 'shared/exception';
import { IFieldValue } from 'shared/interfaces';

/**
 * Field validation interface
 */
export interface IFieldValidatorInterface {

  /**
   * Return `string` for failed validation, return `null` for passed validation
   *
   * @param fieldValue
   * @param field       Field Propertie
   * @param extra       Prompt for additional field
   */
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }): void;

  throwException(field: IField, tipId: ApiTipId, value?: any, property?: string): never;
}
