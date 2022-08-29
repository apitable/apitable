import { ApiProperty } from '@nestjs/swagger';
import { NodeListDto } from 'model/dto/fusion/node.list.dto';
import { ApiResponse } from '../../api.response';

export class NodeListVo extends ApiResponse<NodeListDto> {
  @ApiProperty({ type: NodeListDto })
    data: NodeListDto;
}
