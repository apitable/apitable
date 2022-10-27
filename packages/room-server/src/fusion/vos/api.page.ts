import { ApiProperty } from '@nestjs/swagger';
import { IPaginateInfo } from '../../shared/interfaces';

export class ApiPage<T> implements IPaginateInfo<T> {
  @ApiProperty({
    type: Number,
    example: '1',
    description: '当前页',
  })
    pageNum: number;

  @ApiProperty({
    description: '分页数据',
  })
    records: T;

  @ApiProperty({
    type: Number,
    example: '200',
    description: '每页数量',
  })
    pageSize: number;

  @ApiProperty({
    type: Number,
    example: '2000',
    description: '总条数',
  })
    total: number;
}
