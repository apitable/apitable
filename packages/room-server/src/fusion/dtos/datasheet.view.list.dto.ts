import { ApiProperty } from '@nestjs/swagger';
import { DatasheetViewDto } from 'fusion/dtos/datasheet.view.dto';
import { IViewList } from 'shared/interfaces';

export class DatasheetViewListDto implements IViewList<DatasheetViewDto[]> {
  @ApiProperty({
    type: [DatasheetViewDto],
    description: 'view list',
  })
  views: DatasheetViewDto[];
}
