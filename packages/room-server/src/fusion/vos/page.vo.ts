import { ApiProperty } from '@nestjs/swagger';
import { ApiRecordDto } from '../dtos/api.record.dto';
import { ApiPage } from './api.page';

export class PageVo extends ApiPage<ApiRecordDto[]> {
  @ApiProperty({ type: [ApiRecordDto] })
  records: ApiRecordDto[];

  @ApiProperty({
    type: Number,
    example: 500,
    description: 'Total number of records',
  })
  total: number;

  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Total number of records returned per page',
  })
  pageSize: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Page numbering for pagination',
  })
  pageNum: number;
}
