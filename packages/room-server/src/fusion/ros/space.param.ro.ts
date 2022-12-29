import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SpaceParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spcjXzqVrjaP3',
    description: 'space Id',
  })
  @IsNotEmpty({ message: ApiTipConstant.api_params_instance_space_id_error })
  spaceId: string;
}
