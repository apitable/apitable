import { ApiTipConstant, IAddOpenFieldProperty } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class DatasheetFieldCreateRo {

  @ApiProperty({
    type: String,
    required: true,
    description: 'Field Name',
    example: 'field name'
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'field', value: 'name' } })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Field type',
    example: ''
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'field', value: 'type' } })
  type: string;

  @ApiPropertyOptional({
    type: Object,
    required: false,
    example: '',
    description: 'Field property',
  })
  property?: IAddOpenFieldProperty | null;

}