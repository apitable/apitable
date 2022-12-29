import { ApiProperty } from '@nestjs/swagger';
import { ISpaceList } from 'shared/interfaces';
import { SpaceDto } from './space.dto';

export class SpaceListDto implements ISpaceList<SpaceDto[]> {
  @ApiProperty({
    type: [SpaceListDto],
    description: 'space list',
  })
  spaces: SpaceDto[];
}
