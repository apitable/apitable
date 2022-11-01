import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { stringToArray } from 'shared/helpers/fusion.helper';

export class DatasheetPackRo {
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: 'rec4zxfWB5uyM',
    description: 'Record ID. If this parameter is attached, return the specified records',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
    recordIds: string[];
}
