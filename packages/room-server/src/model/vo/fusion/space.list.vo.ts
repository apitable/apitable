import { ApiProperty } from '@nestjs/swagger';
import { SpaceListDto } from 'model/dto/fusion/space.list.dto';
import { ApiResponse } from '../../api.response';

export class SpaceListVo extends ApiResponse<SpaceListDto> {
  @ApiProperty({ type: SpaceListDto })
    data: SpaceListDto;
}
