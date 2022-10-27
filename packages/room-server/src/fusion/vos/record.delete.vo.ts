import { ApiResponse } from './api.response';
import { ApiProperty } from '@nestjs/swagger';

export class RecordDeleteVo extends ApiResponse<boolean | undefined> {
  @ApiProperty({ type: Boolean })
    data: boolean | undefined;
}
