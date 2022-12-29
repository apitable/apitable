import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangesetRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
    description: 'datasheet ID',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error })
  dstId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0Yj5aNeoHldqvf6',
    description: 'message ID',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_empty_error })
  messageId: string;
}
