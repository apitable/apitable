import { ApiProperty } from '@nestjs/swagger';
import { ViewTypeTextEnum } from 'shared/enums/field.type.enum';
import { IApiDatasheetView } from '../../shared/interfaces';

export class DatasheetViewDto implements IApiDatasheetView {
  @ApiProperty({
    type: String,
    example: 'viwpdA8TUBp5r',
    description: 'view ID',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: 'view name',
    example: 'All the orders',
  })
    name: string;

  @ApiProperty({
    enum: ViewTypeTextEnum,
    description: 'view type: Grid, Gallery, Kanban and Gantt',
    example: ViewTypeTextEnum.Grid,
  })
    type: ViewTypeTextEnum;
}
