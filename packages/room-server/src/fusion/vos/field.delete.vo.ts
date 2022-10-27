import { ApiResponse } from './api.response';
import { ApiProperty } from '@nestjs/swagger';

export class FieldDeleteVo extends ApiResponse<Object> {

  @ApiProperty({ type: Object })
    data: object = {};

}
