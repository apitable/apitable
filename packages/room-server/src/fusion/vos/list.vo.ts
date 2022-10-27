import { ApiProperty } from '@nestjs/swagger';
import { IRecordList } from '../../shared/interfaces';
import { ApiRecordDto } from '../dtos/api.record.dto';

export class ListVo implements IRecordList<ApiRecordDto[]> {
  @ApiProperty({
    type: [ApiRecordDto],
    description: '记录列表',
  })
    records: ApiRecordDto[];
}
