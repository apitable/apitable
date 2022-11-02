import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';

export class FieldDeleteVo extends ApiResponse<Object> {

  @ApiProperty({ type: Object })
  data: object = {};

}
