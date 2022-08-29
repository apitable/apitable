import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { API_MAX_MODIFY_RECORD_COUNTS } from 'common';
import { stringToArray } from 'helpers/fusion.helper';
import { ApiTipIdEnum } from 'enums/string.enum';

export class RecordDeleteRo {
  @ApiProperty({
    type: [String],
    required: true,
    description: '需要删除的record的ID',
    example: 'recwZ6yV3Srv3',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  @ArrayNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
  @ArrayMaxSize(API_MAX_MODIFY_RECORD_COUNTS, { context: { tipId: ApiTipIdEnum.apiParamsMaxCountError, value: API_MAX_MODIFY_RECORD_COUNTS }})
  @ArrayUnique({ context: { tipId: ApiTipIdEnum.apiParamsMustUnique }})
    recordIds: string[];
}
