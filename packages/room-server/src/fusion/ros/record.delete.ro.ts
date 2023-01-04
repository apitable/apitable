import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { stringToArray } from 'shared/helpers/fusion.helper';

export class RecordDeleteRo {
  @ApiProperty({
    type: [String],
    required: true,
    description: 'The set of recordId to be deleted',
    example: 'recwZ6yV3Srv3',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
  recordIds!: string[];
}
