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

import { ApiTipConstant, FieldKeyEnum } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { FieldUpdateRo } from './record.field.update.ro';

export class RecordUpdateRo {
  @ApiProperty({
    type: [FieldUpdateRo],
    required: true,
    description: 'Need to modify the data corresponding column and data',
    example: [
      {
        recordId: 'recrHnjVuH6Fd',
        fields: {
          Currency: 5.53,
          Select: 'Select 1',
        },
      },
      {
        recordId: 'recwZ6yV3Srv3',
        fields: {
          Currency: 5.53,
          Select: 'Select 2',
        },
      },
    ],
  })
  @Type(() => FieldUpdateRo)
  @ArrayNotEmpty({ message: ApiTipConstant.api_params_empty_error })
  @ValidateNested()
  records!: FieldUpdateRo[];

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '[Optional], what the fields map is made of key. id or name, default is name',
    default: FieldKeyEnum.NAME,
  })
  @IsOptional()
  @IsEnum(FieldKeyEnum, { message: ApiTipConstant.api_params_invalid_value })
  fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;

  @Expose()
  getRecordIds() {
    return this.records.map(record => record.recordId);
  }
}
