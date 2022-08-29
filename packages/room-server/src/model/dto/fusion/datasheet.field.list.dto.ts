import { ApiProperty } from '@nestjs/swagger';
import { IFieldList } from 'interfaces';
import { DatasheetFieldDto } from 'model/dto/fusion/datasheet.field.dto';

export class DatasheetFieldListDto implements IFieldList<DatasheetFieldDto[]> {
  @ApiProperty({
    type: [DatasheetFieldDto],
    description: '字段列表',
  })
    fields: DatasheetFieldDto[];
}
