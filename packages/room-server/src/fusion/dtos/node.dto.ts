import { ApiProperty } from '@nestjs/swagger';
import { NodeTypeEnum } from 'shared/enums/node.enum';
import { IAPINode } from 'shared/interfaces/node.interface';

export class NodeDto implements IAPINode {
  @ApiProperty({
    type: String,
    description: 'node ID',
    example: 'fodDWMTvdtmFs',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'node name',
    example: 'order management',
  })
  name: string;

  @ApiProperty({
    enum: NodeTypeEnum,
    description: 'node type',
    example: NodeTypeEnum.Folder,
  })
  type: NodeTypeEnum;

  @ApiProperty({
    type: String,
    description: 'node Emoji ID',
    example: '👋',
  })
  icon: string;

  @ApiProperty({
    type: Boolean,
    description: 'if it had been favorite',
    example: true,
  })
  isFav: boolean;
}
