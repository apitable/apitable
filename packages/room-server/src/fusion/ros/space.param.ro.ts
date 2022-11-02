import { ApiProperty } from '@nestjs/swagger';

export class SpaceParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spcjXzqVrjaP3',
    description: 'space Id',
  })
  spaceId: string;
}
