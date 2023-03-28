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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipConstant } from '@apitable/core';
import { stringToArray } from 'shared/helpers/fusion.helper';
import { Transform } from 'class-transformer';

export class CascaderQueryRo {
  @ApiProperty({
    type: String,
    description: 'View ID',
    example: 'viw****',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error })
  linkedViewId!: string;

  @ApiPropertyOptional({
    type: [String],
    example: 'fld***, fld***',
    description: 'Field IDs',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  linkedFieldIds!: string[];
}
