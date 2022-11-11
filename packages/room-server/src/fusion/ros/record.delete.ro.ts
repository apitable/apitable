import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { API_MAX_MODIFY_RECORD_COUNTS } from 'shared/common';
import { stringToArray } from 'shared/helpers/fusion.helper';

export class RecordDeleteRo {
  @ApiProperty({
    type: [String],
    required: true,
    description: 'The set of recordId to be deleted',
    example: 'recwZ6yV3Srv3',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  @ArrayNotEmpty({ message: ApiTipConstant.api_params_empty_error, context: {} })
  @ArrayMaxSize(API_MAX_MODIFY_RECORD_COUNTS, {
    message: ApiTipConstant.api_params_max_count_error,
    context: { value: API_MAX_MODIFY_RECORD_COUNTS },
  })
  @ArrayUnique({ message: ApiTipConstant.api_params_must_unique, context: {} })
  recordIds: string[];
}
