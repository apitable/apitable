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

import {
  BasicValueType,
  ButtonFieldActionNameEnum,
  ButtonFieldActionOpenLinkNameEnum,
  ButtonFieldStyleNameEnum,
  RollUpFuncType,
} from '@apitable/core';
import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DatasheetFieldDto } from 'fusion/dtos/datasheet.field.dto';
import { ExtraModel } from 'shared/common';
import { UnitTypeTextEnum } from 'shared/enums';

export class ButtonFieldActionOpenLinkDto {
  @ApiProperty({
    enum: ButtonFieldActionOpenLinkNameEnum,
    example: ButtonFieldActionOpenLinkNameEnum.Url,
    description: 'Link type: Url, Expression',
  })
    type!: ButtonFieldActionOpenLinkNameEnum;

  @ApiProperty({
    type: String,
    description: 'Pure url or The expression of the url',
  })
    expression!: string;
}

export class ButtonFieldActionTriggerAutomationDto {
  @ApiProperty({
    example: 'aut***',
    description: 'Automation node id',
  })
    automationId!: string;

  @ApiProperty({
    example: 'atr***',
    description: 'The Trigger id to be triggered',
  })
    triggerId!: string;
}
export class ColorProperty {
  @ApiProperty({
    example: 'red_0',
    description: 'color name',
  })
    name!: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'color value',
  })
    value!: string;
}

export class ButtonFieldPropertyStyleDto {
  @ApiProperty({
    type: ColorProperty,
    description: 'Color',
  })
    color!: ColorProperty;

  @ApiProperty({
    enum: ButtonFieldStyleNameEnum,
    example: ButtonFieldStyleNameEnum.Background,
    description: 'Button style type: Background, OnlyText',
  })
    type!: ButtonFieldStyleNameEnum;
}

export class ButtonFieldPropertyActionDto {
  @ApiProperty({
    enum: ButtonFieldActionNameEnum,
    example: ButtonFieldActionNameEnum.OpenLink,
    description: 'Button action type: OpenLink, TriggerAutomation',
  })
    type!: ButtonFieldActionNameEnum;

  @ApiPropertyOptional({
    type: ButtonFieldActionOpenLinkDto,
    description: 'Click to open a link',
  })
  @IsOptional()
    openLink?: ButtonFieldActionOpenLinkDto;

  @ApiPropertyOptional({
    type: ButtonFieldActionTriggerAutomationDto,
    description: 'Click to trigger an automation',
  })
  @IsOptional()
    automation?: ButtonFieldActionTriggerAutomationDto;
}

class MemberProperty {
  @ApiProperty({
    type: String,
    example: '1217029313010270209',
    description: 'member ID',
  })
    id!: string;

  @ApiProperty({
    type: String,
    example: 'LiLei',
    description: 'member name',
  })
    name!: string;

  @ApiProperty({
    enum: UnitTypeTextEnum,
    example: UnitTypeTextEnum.Member,
    description: 'unit type: member and team',
  })
    type!: UnitTypeTextEnum;

  @ApiPropertyOptional({
    type: String,
    example: 'https://aitable.ai/default/avatar001.jpg',
    description: 'avatar',
  })
  @IsOptional()
    avatar?: string;
}

class UserProperty {
  @ApiProperty({
    type: String,
    example: 'eeb620a54e2248c69c25de68e6eb668c',
    description: 'user id. special ID for Anonymous and robot',
  })
    id!: string;

  @ApiProperty({
    type: String,
    example: 'LiLei',
    description: 'user name',
  })
    name!: string;

  @ApiProperty({
    type: String,
    example: 'https://aitable.ai/default/avatar001.jpg',
    description: 'avatar',
  })
    avatar!: string;
}

class DatasheetField {
  @ApiProperty({
    type: String,
    example: 'dstxxxxxxx',
    description: 'reference datasheet ID',
  })
    datasheetId!: string;

  @ApiProperty({
    type: () => DatasheetFieldDto,
    description: 'reference field',
    example:
      '{"id": "fldsRHWJZwFcM","name": "order number","type": "SingleText","desc": "automatically",' +
      '"property": {"defaultValue": "to be added"},"permissionLevel": "edit" }',
  })
    field!: DatasheetFieldDto;
}

class SingleSelectProperty {
  @ApiProperty({
    type: String,
    example: 'opt8QSSURh52T',
    description: 'option ID',
  })
    id!: string;

  @ApiProperty({
    type: String,
    example: 'magical',
    description: 'option name',
  })
    name!: string;

  @ApiProperty({
    type: Object,
    example: '{"name":"red_0", "value":"#ff0000"}',
    description: 'option color',
  })
    color!: Object;
}

@ApiExtraModels(ExtraModel)
export class SingleTextPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: 'to be added',
    description: 'default value',
  })
    defaultValue?: string;
}

@ApiExtraModels(ExtraModel)
export class NumberFieldPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: 'to be added',
    description: 'default value',
  })
    defaultValue?: string;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'digital display accuracy 0-4',
  })
    precision!: number;
}

@ApiExtraModels(ExtraModel)
export class CurrencyFieldPropertyDto extends NumberFieldPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: '$',
    description: 'Currency symbols, customizable to any character',
  })
    symbol?: string;
}

@ApiExtraModels(ExtraModel)
export class SelectFieldPropertyDto {
  @ApiProperty({
    type: [SingleSelectProperty],
    description: 'Radio Field Properties',
  })
    options!: SingleSelectProperty[];
}

@ApiExtraModels(ExtraModel)
export class MemberFieldPropertyDto {
  @ApiProperty({
    type: [MemberProperty],
    description: 'Member Field Properties',
  })
    options!: MemberProperty[];
}

@ApiExtraModels(ExtraModel)
export class UserPropertyDto {
  @ApiProperty({
    type: [UserProperty],
    description: 'CreateBy｜LastModifiedBy Field Properties',
  })
    options!: UserProperty[];
}

@ApiExtraModels(ExtraModel)
export class CheckboxFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: '✅',
    description: 'emoji character',
  })
    icon!: string;
}

@ApiExtraModels(ExtraModel)
export class RatingFieldPropertyDto extends CheckboxFieldPropertyDto {
  @ApiProperty({
    type: Number,
    example: 5,
    description: 'Rating Maximum 1-10',
  })
    max!: number;
}

@ApiExtraModels(ExtraModel)
export class DateTimeFieldPropertyDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'YYYY/MM/DD HH:mm',
    description:
      'Date Format ' +
      '\n The value of the date field returns a timestamp, with no restrictions on formatting. ' +
      'The format information in the field properties can be used for formatting, see dayjs format for the meaning' +
      "\n If you don't want to deal with date formatting and want the returned results to be consistent with the view display, " +
      'you can assign cellFormat to string in the query parameters, and the returned content will all be strings',
  })
    format!: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description: 'Whether the time is automatically filled when a new record is created',
  })
    autoFill!: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description: 'Whether to display the time',
  })
    includeTime!: boolean;

  @ApiProperty({
    required: false,
    type: String,
    example: 'America/Toronto',
    description: 'The time zone of the date time',
  })
    timeZone!: string;

  @ApiProperty({
    required: false,
    type: Boolean,
    example: true,
    description: 'Whether to show time zone',
  })
    includeTimeZone?: boolean;
}

@ApiExtraModels(ExtraModel)
export class LinkFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'dstg3kerxz9DYzGjvs',
    description: 'related datasheet Id',
  })
    foreignDatasheetId!: string;

  @ApiProperty({
    type: String,
    example: 'fidxxxxxxx',
    description: 'related datasheet brother field Id',
  })
    brotherFieldId!: string;
}

@ApiExtraModels(ExtraModel)
export class LookupFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'fidxxxxxxx',
    description: 'Referencing dependent association field Id',
  })
    relatedLinkFieldId!: string;

  @ApiProperty({
    type: DatasheetField,
    description: 'Reference field',
  })
    targetField!: DatasheetField;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'When the associated field of a `lookup` dependency is deleted or converted to a type, the reference value may not be obtained properly',
  })
    hasError?: boolean;

  @ApiPropertyOptional({
    type: DatasheetField,
    description:
      'The entity field that is eventually referenced does not contain a field of type `lookup`. In case of an error, the entity field may not exist',
  })
    entityField?: DatasheetField;

  @ApiProperty({
    enum: RollUpFuncType,
    example: RollUpFuncType.VALUES,
    description: 'rollup function',
  })
    rollupFunction!: RollUpFuncType;

  @ApiProperty({
    enum: BasicValueType,
    example: BasicValueType.String,
    description: 'Return Value Type: String,Boolean,Number,DateTime,Array',
  })
    valueType!: BasicValueType;
}

@ApiExtraModels(ExtraModel)
export class FormulaFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: '{fidxxxxxx}',
    description: 'Formula expression',
  })
    expression!: string;

  @ApiProperty({
    enum: BasicValueType,
    example: BasicValueType.String,
    description: 'Return Value Type: String,Boolean,Number,DateTime,Array',
  })
    valueType!: BasicValueType;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'When the associated field of a `lookup` dependency is deleted or converted to a type, the reference value may not be obtained properly',
  })
    hasError?: boolean;
}

@ApiExtraModels(ExtraModel)
export class ButtonFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'Click Button',
    description: 'Button text',
  })
    text!: string;

  @ApiProperty({
    type: ButtonFieldPropertyStyleDto,
    description: 'Button field style',
  })
    style!: ButtonFieldPropertyStyleDto;

  @ApiPropertyOptional({
    type: ButtonFieldPropertyActionDto,
    description: 'Button field action',
  })
    action?: ButtonFieldPropertyActionDto;
}

