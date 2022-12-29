import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RobotCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  resourceId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'robot 001',
    description: 'name of robot',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  description: string;
}
