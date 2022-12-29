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

import { IActionResponse } from './action.response';
import { IJsonSchema } from '@apitable/core';

export type IUiSchema = {
  'ui:field'?: string;
  'ui:widget'?: string;
  'ui:options'?: { [key: string]: boolean | number | string | object | any[] | null };
  'ui:order'?: string[];
  'ui:FieldTemplate'?: object;
  'ui:ArrayFieldTemplate'?: object;
  'ui:ObjectFieldTemplate'?: object;
  [name: string]: any;
};

export interface IBaseAction {

  endpoint(input: any): Promise<IActionResponse<any>>;

  getInputSchema(): IJsonSchema;

  getUISchema(): IUiSchema;

  getOutputSchema(): IJsonSchema;
}