import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';
import { ListVo } from './list.vo';

export class RecordListVo extends ApiResponse<ListVo> {
  @ApiProperty({ type: ListVo })
  data: ListVo;
}
