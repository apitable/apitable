import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(DatasheetDto)
export class DatasheetDto {
  @ApiProperty({
    type: Number,
    example: 0,
    description: '主键',
  })
    id: number;

  @ApiProperty({
    type: String,
    description: '自定义ID',
  })
    dstId: string;

  @ApiProperty({
    type: String,
    description: '名称',
  })
    dstName: string;

  @ApiProperty({
    type: String,
    description: '数表节点Id(关联#vika_node#node_id)',
  })
    nodeId: string;

  @ApiProperty({
    type: String,
    description: '版本号',
  })
    revision: string;
}
