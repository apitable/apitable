import { ApiProperty } from '@nestjs/swagger';
import { IRecordList } from 'shared/interfaces';
import { ApiRecordDto } from '../dtos/api.record.dto';

export class ListVo implements IRecordList<ApiRecordDto[]> {
  @ApiProperty({
    type: [ApiRecordDto],
    description: 'Record List',
  })
  records: ApiRecordDto[];
}
