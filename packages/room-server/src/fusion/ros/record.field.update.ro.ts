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

import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { ICellValueMap } from 'shared/interfaces';

export class FieldUpdateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: 'The columns and data corresponding to the data to be created',
    example: {
      Matter: '"Organizational Structure" module - Organizational structure display in the address book panel',
      'Problem Description': 'Essentially the same requirement as above',
      Select: 'Product Requirements',
      'Review Date': '2019-10-30T00:00:00.000Z',
    },
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_fields_error })
  fields!: ICellValueMap;

  @ApiProperty({
    type: String,
    required: true,
    description: 'record Id',
    example: 'recV3ElniQavTNyJG',
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_recordid_error })
  @IsString()
  recordId!: string;
}
