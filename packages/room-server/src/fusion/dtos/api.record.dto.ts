import { ApiProperty } from '@nestjs/swagger';
import { IFieldValueMap, IApiRecord } from '../../shared/interfaces';

export class ApiRecordDto implements IApiRecord {
  @ApiProperty({
    type: String,
    example: 'recV3ElniQavTNyJG',
    description: 'record ID',
  })
    recordId: string;

  @ApiProperty({
    type: Object,
    description: 'fields\'s map, the structure is {"field": "value"}',
  })
    fields: IFieldValueMap;

  @ApiProperty({
    type: Number,
    description: 'created time, timestamp',
  })
    createdAt: number;

  @ApiProperty({
    type: Number,
    description: 'updated time, timestamp',
  })
    updatedAt: number;
}
