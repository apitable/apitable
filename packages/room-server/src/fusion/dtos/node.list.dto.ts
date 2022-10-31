import { ApiProperty } from '@nestjs/swagger';
import { INodeList } from '../../shared/interfaces';
import { NodeDto } from './node.dto';

export class NodeListDto implements INodeList<NodeDto[]> {
  @ApiProperty({
    type: [NodeDto],
    description: 'node list',
  })
    nodes: NodeDto[];
}
