import { ApiProperty } from '@nestjs/swagger';
import { IRecordList } from 'interfaces';
import { ApiRecordDto } from 'model/dto/fusion/api.record.dto';

export class ListVo implements IRecordList<ApiRecordDto[]> {
  @ApiProperty({
    type: [ApiRecordDto],
    description: '记录列表',
  })
    records: ApiRecordDto[];
}
