import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
    description: 'datasheet ID',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  dstId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'rec0Yj5aNeoHldqvf6',
    description: 'record ID',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  recId: string;
}
