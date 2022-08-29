import { ApiProperty } from '@nestjs/swagger';
import { ViewTypeTextEnum } from 'enums/field.type.enum';
import { IApiDatasheetView } from 'interfaces';

export class DatasheetViewDto implements IApiDatasheetView {
  @ApiProperty({
    type: String,
    example: 'viwpdA8TUBp5r',
    description: '视图 ID',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: '视图名称',
    example: '全部订单',
  })
    name: string;

  @ApiProperty({
    enum: ViewTypeTextEnum,
    description: '视图类型 Grid、Gallery、Kanban、Gantt',
    example: ViewTypeTextEnum.Grid,
  })
    type: ViewTypeTextEnum;
}
