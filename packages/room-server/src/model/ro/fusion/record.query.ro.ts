import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant, CellFormatEnum, FieldKeyEnum } from '@apitable/core';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { stringToArray } from 'helpers/fusion.helper';
import { PageRo } from '../page.ro';

export class RecordQueryRo extends PageRo {
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: 'rec4zxfWB5uyM',
    description: '记录ID。如果附带此参数，则返回指定的单条记录',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
    recordIds: string[];

  @ApiPropertyOptional({
    type: String,
    example: 'viwG9l1VPD6nH',
    description:
      '视图ID,如果附带此参数,则只返回经过视图筛选后的记录合集.注：可以搭配使用fields参数过滤不需要的字段数据',
  })
    viewId: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      '指定要返回的字段。如果附带此参数，则返回的记录合集将会被过滤，只有指定的字段会返回。读取多列举例：&fields[]=fld4jt0XoRm2h&fields[]=fld8RI3QY4Wdz',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
    fields: string[];

  @ApiPropertyOptional({
    type: String,
    description: '使用方程式作为筛选条件。注：如果此参数与viewId参数一起使用，则只会返回指定视图中满足此方程式的记录合集',
  })
    filterByFormula: string;

  @ApiPropertyOptional({
    enum: CellFormatEnum,
    description: 'string/json,默认为json',
    default: CellFormatEnum.JSON,
  })
  @IsEnum(CellFormatEnum, { message: ApiTipConstant.api_params_cellformat_error })
    cellFormat: CellFormatEnum = CellFormatEnum.JSON;

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '【可选】，fields map 是由什么做 key。id 或者 name, 默认为 name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { message: ApiTipConstant.api_params_invalid_field_key })
    fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;
}
