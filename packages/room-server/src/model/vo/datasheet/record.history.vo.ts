import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from 'model/api.response';
import { RecordHistoryDto } from 'model/dto/datasheet/record.history.dto';

export class RecordHistoryVo extends ApiResponse<RecordHistoryDto | null> {
  @ApiProperty({
    type: RecordHistoryDto,
    description: '记录评论列表',
  })
    data: RecordHistoryDto | null;
}
