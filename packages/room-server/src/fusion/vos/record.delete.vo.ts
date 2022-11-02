import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';

export class RecordDeleteVo extends ApiResponse<boolean | undefined> {
  @ApiProperty({ type: Boolean })
  data: boolean | undefined;
}
