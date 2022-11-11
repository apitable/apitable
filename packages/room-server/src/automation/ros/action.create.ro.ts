import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActionCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'arbxxxxxx',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  robotId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'aatxxxxxxx',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  actionTypeId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'aatxxxxxxx',
  })
  prevActionId: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: {},
  })
  input: object;
}
