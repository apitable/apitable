import { ApiProperty } from '@nestjs/swagger';
import { IViewList } from '../../shared/interfaces';
import { DatasheetViewDto } from 'fusion/dtos/datasheet.view.dto';

export class DatasheetViewListDto implements IViewList<DatasheetViewDto[]> {
  @ApiProperty({
    type: [DatasheetViewDto],
    description: '字段列表',
  })
    views: DatasheetViewDto[];
}
