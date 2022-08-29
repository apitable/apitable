import { ApiProperty } from '@nestjs/swagger';
import { IViewList } from 'interfaces';
import { DatasheetViewDto } from 'model/dto/fusion/datasheet.view.dto';

export class DatasheetViewListDto implements IViewList<DatasheetViewDto[]> {
  @ApiProperty({
    type: [DatasheetViewDto],
    description: '字段列表',
  })
    views: DatasheetViewDto[];
}
