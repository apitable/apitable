import { ApiPage } from '../../api.page';
import { ApiProperty } from '@nestjs/swagger';
import { ApiRecordDto } from 'model/dto/fusion/api.record.dto';

export class PageVo extends ApiPage<ApiRecordDto[]> {
  @ApiProperty({ type: [ApiRecordDto] })
    records: ApiRecordDto[];

  @ApiProperty({
    type: Number,
    example: 500,
    description: '总记录条数',
  })
    total: number;

  @ApiProperty({
    type: Number,
    example: 100,
    description: '每页返回的记录总数',
  })
    pageSize: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: '分页的页码',
  })
    pageNum: number;
}
