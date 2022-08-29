import { ApiProperty } from '@nestjs/swagger';
import { ISpaceList } from 'interfaces';
import { SpaceDto } from './space.dto';

export class SpaceListDto implements ISpaceList<SpaceDto[]> {
  @ApiProperty({
    type: [SpaceListDto],
    description: '视图列表',
  })
    spaces: SpaceDto[];
}
