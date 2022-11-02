import { ApiProperty } from '@nestjs/swagger';
import { DatasheetFieldDto } from 'fusion/dtos/datasheet.field.dto';
import { IFieldList } from 'shared/interfaces';

export class DatasheetFieldListDto implements IFieldList<DatasheetFieldDto[]> {
  @ApiProperty({
    type: [DatasheetFieldDto],
    description: 'field list',
  })
  fields: DatasheetFieldDto[];
}
