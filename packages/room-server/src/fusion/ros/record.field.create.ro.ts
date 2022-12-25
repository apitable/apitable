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
import { IsDefined } from 'class-validator';
import { ICellValueMap } from 'shared/interfaces';

export class FieldCreateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: 'The columns and data corresponding to the data to be created',
    example: { Currency: 5.53, Select: 'Select 1' },
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_fields_error })
  fields!: ICellValueMap;
}
