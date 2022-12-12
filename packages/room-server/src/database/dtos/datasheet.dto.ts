import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(DatasheetDto)
export class DatasheetDto {
  @ApiProperty({
    type: Number,
    example: 0,
    description: 'primary key',
  })
    id: number;

  @ApiProperty({
    type: String,
    description: 'datasheet ID',
  })
    dstId: string;

  @ApiProperty({
    type: String,
    description: 'datasheet name',
  })
    dstName: string;

  @ApiProperty({
    type: String,
    description: 'node ID(refer to node#node_id)',
  })
    nodeId: string;

  @ApiProperty({
    type: String,
    description: 'revision',
  })
    revision: string;
}
