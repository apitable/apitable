import { ApiProperty } from '@nestjs/swagger';
import { DatasheetViewListDto } from 'model/dto/fusion/datasheet.view.list.dto';
import { ApiResponse } from '../../api.response';

export class ViewListVo extends ApiResponse<DatasheetViewListDto> {
  @ApiProperty({ type: DatasheetViewListDto })
    data: DatasheetViewListDto;
}
