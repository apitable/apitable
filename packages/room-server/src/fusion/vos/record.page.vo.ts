import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';
import { PageVo } from './page.vo';

export class RecordPageVo extends ApiResponse<PageVo> {
  @ApiProperty({ type: PageVo })
  data: PageVo;
}
