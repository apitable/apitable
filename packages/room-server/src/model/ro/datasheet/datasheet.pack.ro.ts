import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { stringToArray } from 'helpers/fusion.helper';

export class DatasheetPackRo {
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: 'rec4zxfWB5uyM',
    description: '记录ID。如果附带此参数，则返回指定的单条记录',
  })
  @Transform(value => stringToArray(value), { toClassOnly: true })
    recordIds: string[];
}
