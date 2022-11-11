import { ApiTipConstant } from '@apitable/core';
import { object } from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TriggerCreateRo {
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
    example: 'attxxxxxxx',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  triggerTypeId: string;

  @ApiProperty({
    type: object,
    required: false,
    example: '{}',
    description: 'trigger input',
  })
  input: object;
}
