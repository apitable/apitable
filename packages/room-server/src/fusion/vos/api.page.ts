import { ApiProperty } from '@nestjs/swagger';
import { IPaginateInfo } from 'shared/interfaces';

export class ApiPage<T> implements IPaginateInfo<T> {
  @ApiProperty({
    type: Number,
    example: '1',
    description: 'Current page number',
  })
  pageNum: number;

  @ApiProperty({
    description: 'Paging Data',
  })
  records: T;

  @ApiProperty({
    type: Number,
    example: '200',
    description: 'Number per page',
  })
  pageSize: number;

  @ApiProperty({
    type: Number,
    example: '2000',
    description: 'Total number of records',
  })
  total: number;
}
