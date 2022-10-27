import { ApiProperty } from '@nestjs/swagger';
import { NodeListDto } from '../dtos/node.list.dto';
import { ApiResponse } from './api.response';

export class NodeListVo extends ApiResponse<NodeListDto> {
  @ApiProperty({ type: NodeListDto })
    data: NodeListDto;
}
