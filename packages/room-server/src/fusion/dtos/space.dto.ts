import { ApiProperty } from '@nestjs/swagger';
import { IAPISpace } from 'shared/interfaces/space.interface';

export class SpaceDto implements IAPISpace {
  @ApiProperty({
    type: String,
    description: 'space ID',
    example: 'spczdmQDfBAn5',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'space name',
    example: 'Vika',
  })
  name: string;
}
