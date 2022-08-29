import { ApiProperty } from '@nestjs/swagger';

export class NodeListParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spczdmQDfBAn5',
    description: '空间站 ID',
  })
    spaceId: string;
}

export class OldNodeDetailParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spczdmQDfBAn5',
    description: '空间站 ID',
  })
    spaceId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'dstS94qPZFXjC1LKns',
    description: '节点 ID',
  })
    nodeId: string;
}

export class NodeDetailParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dstS94qPZFXjC1LKns',
    description: '节点 ID',
  })
    nodeId: string;
}