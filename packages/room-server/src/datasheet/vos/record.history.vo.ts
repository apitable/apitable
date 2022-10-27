import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../fusion/vos/api.response';
import { RecordHistoryDto } from '../dtos/record.history.dto';

export class RecordHistoryVo extends ApiResponse<RecordHistoryDto | null> {
  @ApiProperty({
    type: RecordHistoryDto,
    description: '记录评论列表',
  })
    data: RecordHistoryDto | null;
}
