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

import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';

export class FieldCreateDto {

  @ApiProperty({ type: String, description: 'Field Id' })
  id!: string;

  @ApiProperty({ type: String, description: 'Field Name' })
  name!: string;

}

export class DatasheetCreateDto {

  @ApiProperty({ type: String, description: 'Datasheet Id' })
  id!: string;

  @ApiProperty({ type: Number, description: 'Create Timestamp' })
  createdAt!: number;

  @ApiProperty({ type: [FieldCreateDto] })
  fields!: FieldCreateDto[];

}

export class DatasheetCreateVo extends ApiResponse<Object> {

  @ApiProperty({ type: DatasheetCreateDto })
  override data!: DatasheetCreateDto;

}

export class FieldCreateVo extends ApiResponse<Object> {

  @ApiProperty({ type: DatasheetCreateDto })
  override data!: FieldCreateDto;

}