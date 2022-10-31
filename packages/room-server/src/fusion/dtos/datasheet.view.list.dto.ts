import { ApiProperty } from '@nestjs/swagger';
import { IViewList } from '../../shared/interfaces';
import { DatasheetViewDto } from 'fusion/dtos/datasheet.view.dto';

export class DatasheetViewListDto implements IViewList<DatasheetViewDto[]> {
  @ApiProperty({
    type: [DatasheetViewDto],
    description: 'view list',
  })
    views: DatasheetViewDto[];
}
