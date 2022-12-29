import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { stringToArray } from 'shared/helpers/fusion.helper';

export class RecordDeleteRo {
  @ApiProperty({
    type: [String],
    required: true,
    description: 'The set of recordId to be deleted',
    example: 'recwZ6yV3Srv3',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  @ArrayNotEmpty({ message: ApiTipConstant.api_params_empty_error })
  @ArrayUnique({ message: ApiTipConstant.api_params_must_unique })
  recordIds: string[];
}
