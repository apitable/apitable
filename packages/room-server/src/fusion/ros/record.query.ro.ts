import { ApiTipConstant, CellFormatEnum, FieldKeyEnum } from '@apitable/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { PageRo } from 'database/ros/page.ro';
import { stringToArray } from 'shared/helpers/fusion.helper';

export class RecordQueryRo extends PageRo {
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: 'rec4zxfWB5uyM',
    description: 'If this parameter is included, the specified single record is returned.',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  recordIds: string[];

  @ApiPropertyOptional({
    type: String,
    example: 'viwG9l1VPD6nH',
    description:
      'If this parameter is included, only the set of records filtered by the view will be returned' +
      '\nNote: You can filter the data of unwanted fields with the fields parameter',
  })
  viewId: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Specifies the fields to be returned. If this parameter is attached, ' +
      'the returned record set will be filtered and only the specified fields will be returned.' +

      '\nExample of reading multiple columns：&fields[]=fld4jt0XoRm2h&fields[]=fld8RI3QY4Wdz',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  fields: string[];

  @ApiPropertyOptional({
    type: String,
    description:
      'Use `formula` as filter condition.' +

      '\nNote: If this parameter is used with the viewId parameter, ' +
      'only the ensemble of records in the specified view that satisfy this equation will be returned',
  })
  filterByFormula: string;

  @ApiPropertyOptional({
    enum: CellFormatEnum,
    description: 'string/json; Default is json',
    default: CellFormatEnum.JSON,
  })
  @IsEnum(CellFormatEnum, { message: ApiTipConstant.api_params_cellformat_error })
  cellFormat: CellFormatEnum = CellFormatEnum.JSON;

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '[Optional], what the fields map is made of key. id or name, default is name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { message: ApiTipConstant.api_params_invalid_field_key })
  fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;
}
