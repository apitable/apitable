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

import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { BroadcastTypes } from 'shared/enums/broadcast-types.enum';

export class FieldPermissionChange {
  @IsArray()
  uuids!: string[];

  @IsString()
  role!: string;

  @IsObject()
  permission: any;
}

export class FieldPermissionChangeRo {
  @IsEnum(BroadcastTypes)
  event!: BroadcastTypes;

  @IsString()
  datasheetId!: string;

  @IsString()
  fieldId!: string;

  @IsString()
  operator!: string;

  @IsInt()
  changeTime!: number;

  @IsObject()
  @IsOptional()
  setting?: any;

  @IsArray()
  @IsOptional()
  changes?: FieldPermissionChange[];
}
