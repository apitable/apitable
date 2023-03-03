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

import type { IAPIMetaFieldProperty } from 'types/field_api_property_types';
import type { APIMetaFieldType } from './field_api_enums';

/**
  * Field related
  */
export interface IAPIMetaField {
   id: string;
   name: string;
   type: APIMetaFieldType;
   isPrimary?: boolean;
   desc?: string;
   property?: IAPIMetaFieldProperty;
   /**
    * manage > edit > read
    * manage management fields
    * edit write cell
    * read read cell
    */
   // The permission level is not exposed for the time being, and it will be considered when the meta is writable in the future.
   // permissionLevel: APIMetaFieldPermissionLevel;
   // Whether the cell can be edited
   editable: boolean;
}