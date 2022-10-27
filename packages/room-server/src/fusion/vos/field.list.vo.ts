import { ApiProperty } from '@nestjs/swagger';
import { DatasheetFieldListDto } from '../dtos/datasheet.field.list.dto';
import { ApiResponse } from './api.response';

export class FieldListVo extends ApiResponse<DatasheetFieldListDto> {
  @ApiProperty({ type: DatasheetFieldListDto })
    data: DatasheetFieldListDto;
}
