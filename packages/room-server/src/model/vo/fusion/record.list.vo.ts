import { ApiResponse } from '../../api.response';
import { ListVo } from './list.vo';
import { ApiProperty } from '@nestjs/swagger';

export class RecordListVo extends ApiResponse<ListVo> {
  @ApiProperty({ type: ListVo })
    data: ListVo;
}
