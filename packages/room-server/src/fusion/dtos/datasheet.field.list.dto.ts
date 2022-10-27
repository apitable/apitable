import { ApiProperty } from '@nestjs/swagger';
import { IFieldList } from '../../shared/interfaces';
import { DatasheetFieldDto } from 'fusion/dtos/datasheet.field.dto';

export class DatasheetFieldListDto implements IFieldList<DatasheetFieldDto[]> {
  @ApiProperty({
    type: [DatasheetFieldDto],
    description: '字段列表',
  })
    fields: DatasheetFieldDto[];
}
