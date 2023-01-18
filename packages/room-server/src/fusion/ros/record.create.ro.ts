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
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { FieldCreateRo } from './record.field.create.ro';

export class RecordCreateRo {
  @ApiProperty({
    type: [FieldCreateRo],
    required: true,
    description: 'Data to be created',
    example: [
      {
        fields: {
          Matter: '"Organizational Structure" module - Organizational structure display in the address book panel',
          'Problem Description': 'Essentially the same requirement as above',
          Select: 'Product Requirements',
          'Review Date': '2019-10-30T00:00:00.000Z',
        },
      },
      {
        fields: {
          Matter: '"Members" module - set your department',
          'Problem Description':
            'After selecting a person, you can adjust the multiple departments he belongs to' +
            '\nAfter selecting the department, you can also add members to the current department',
          Select: 'Product Requirements',
          'Review Date': '2019-10-29T16:00:00.000Z',
        },
      },
    ],
  })
  @Type(() => FieldCreateRo)
  @ArrayNotEmpty({ message: ApiTipConstant.api_params_records_empty_error })
  @ValidateNested()
  records!: FieldCreateRo[];

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '[Optional], what the fields map is made of key. id or name, default is name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { message: ApiTipConstant.api_params_invalid_field_key })
  @IsOptional()
  fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;
}
