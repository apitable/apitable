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

import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  ButtonFieldPropertyDto,
  CheckboxFieldPropertyDto,
  CurrencyFieldPropertyDto,
  DateTimeFieldPropertyDto,
  FormulaFieldPropertyDto,
  LinkFieldPropertyDto,
  LookupFieldPropertyDto,
  MemberFieldPropertyDto,
  NumberFieldPropertyDto,
  RatingFieldPropertyDto,
  SelectFieldPropertyDto,
  SingleTextPropertyDto,
  UserPropertyDto,
} from 'fusion/dtos/field.property.dto';
import { FieldPermissionEnum, FieldTypeTextEnum } from 'shared/enums/field.type.enum';
import { IApiDatasheetField } from 'shared/interfaces';

export class DatasheetFieldDto implements IApiDatasheetField {
  @ApiProperty({
    type: String,
    example: 'fldsRHWJZwFcM',
    description: 'field ID',
  })
    id!: string;

  @ApiProperty({
    type: String,
    description: 'field name',
    example: 'order id',
  })
    name!: string;

  @ApiProperty({
    enum: FieldTypeTextEnum,
    description: 'field type',
    example: FieldTypeTextEnum.SingleText,
  })
    type!: FieldTypeTextEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'field description',
    example: 'do not change it, it was generated automatically',
  })
  @IsOptional()
    desc?: string;

  @ApiPropertyOptional({
    description: 'field property',
    oneOf: [
      { $ref: getSchemaPath(SingleTextPropertyDto) },
      { $ref: getSchemaPath(NumberFieldPropertyDto) },
      { $ref: getSchemaPath(CurrencyFieldPropertyDto) },
      { $ref: getSchemaPath(SelectFieldPropertyDto) },
      { $ref: getSchemaPath(MemberFieldPropertyDto) },
      { $ref: getSchemaPath(UserPropertyDto) },
      { $ref: getSchemaPath(CheckboxFieldPropertyDto) },
      { $ref: getSchemaPath(RatingFieldPropertyDto) },
      { $ref: getSchemaPath(DateTimeFieldPropertyDto) },
      { $ref: getSchemaPath(LinkFieldPropertyDto) },
      { $ref: getSchemaPath(LookupFieldPropertyDto) },
      { $ref: getSchemaPath(FormulaFieldPropertyDto) },
      { $ref: getSchemaPath(ButtonFieldPropertyDto) },
    ],
    example: '{"defaultValue":"to be added"}',
  })
    property?:
    | SingleTextPropertyDto
    | NumberFieldPropertyDto
    | CurrencyFieldPropertyDto
    | SelectFieldPropertyDto
    | MemberFieldPropertyDto
    | UserPropertyDto
    | CheckboxFieldPropertyDto
    | RatingFieldPropertyDto
    | DateTimeFieldPropertyDto
    | LinkFieldPropertyDto
    | LookupFieldPropertyDto
    | FormulaFieldPropertyDto
    | ButtonFieldPropertyDto;

  @ApiPropertyOptional({
    enum: FieldPermissionEnum,
    description: 'user permission type of this field',
    example: FieldPermissionEnum.Edit,
  })
    permissionLevel?: FieldPermissionEnum;
}
