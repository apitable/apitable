import { ApiProperty } from '@nestjs/swagger';
import { IFieldValueMap, IApiRecord } from '../../shared/interfaces';

export class ApiRecordDto implements IApiRecord {
  @ApiProperty({
    type: String,
    example: 'recV3ElniQavTNyJG',
    description: '记录ID',
  })
    recordId: string;

  @ApiProperty({
    type: Object,
    description: '请求是传入的fields对应的数据{"field": "value"}',
  })
    fields: IFieldValueMap;

  @ApiProperty({
    type: Number,
    description: '记录创建时间,时间戳',
  })
    createdAt: number;

  @ApiProperty({
    type: Number,
    description: '记录修改时间,时间戳',
  })
    updatedAt: number;
}
