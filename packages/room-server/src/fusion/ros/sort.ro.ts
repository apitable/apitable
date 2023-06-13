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
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { OrderEnum } from 'shared/enums';
import { ISortRo } from 'shared/interfaces';

export class SortRo implements ISortRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'fldAj8ZBpzj1X',
    description: 'Specify the field to sort',
  })
  @IsDefined({ message: ApiTipConstant.api_param_sort_missing_field })
  @IsString()
  field!: string;

  @ApiProperty({
    enum: OrderEnum,
    required: true,
    example: 'fldAj8ZBpzj1X',
    description: 'Specify the order type(asc/desc)',
  })
  @IsEnum(OrderEnum, {
    message: ApiTipConstant.api_params_invalid_order_sort,
  })
  order!: OrderEnum;
}
