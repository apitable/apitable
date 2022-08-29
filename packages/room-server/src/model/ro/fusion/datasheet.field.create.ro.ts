import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant, IAddOpenFieldProperty } from '@vikadata/core';
import { IsDefined } from 'class-validator';

export class DatasheetFieldCreateRo {

  @ApiProperty({
    type: String,
    required: true,
    description: '字段名称',
    example: '名称'
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'field', value: 'name' }})
    name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '字段类型',
    example: ''
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'field', value: 'type' }})
    type: string;

  /** 字段配置 */
  @ApiPropertyOptional({
    type: Object,
    required: false,
    example: '',
    description: '属性',
  })
    property?: IAddOpenFieldProperty | null;

}