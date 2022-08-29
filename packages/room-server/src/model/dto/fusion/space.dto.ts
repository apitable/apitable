import { ApiProperty } from '@nestjs/swagger';
import { IAPISpace } from 'interfaces/space.interface';

export class SpaceDto implements IAPISpace {
  @ApiProperty({
    type: String,
    description: '空间站 ID',
    example: 'spczdmQDfBAn5',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: '空间站名称',
    example: 'Vika',
  })
    name: string;
}
