import { ApiProperty } from '@nestjs/swagger';
import { NodeTypeEnum } from 'shared/enums/node.enum';
import { IAPINode } from 'shared/interfaces/node.interface';

export class NodeDto implements IAPINode {
  @ApiProperty({
    type: String,
    description: '节点 ID',
    example: 'fodDWMTvdtmFs',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: '节点名称',
    example: '订单管理',
  })
    name: string;

  @ApiProperty({
    enum: NodeTypeEnum,
    description: '节点类型',
    example: NodeTypeEnum.Folder,
  })
    type: NodeTypeEnum;

  @ApiProperty({
    type: String,
    description: '节点 Emoji ID',
    example: '👋',
  })
    icon: string;

  @ApiProperty({
    type: Boolean,
    description: '是否收藏过节点',
    example: true,
  })
    isFav: boolean;
}
