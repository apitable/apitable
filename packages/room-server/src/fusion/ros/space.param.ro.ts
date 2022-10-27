import { ApiProperty } from '@nestjs/swagger';

export class SpaceParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spcjXzqVrjaP3',
    description: '空间ID',
  })
    spaceId: string;
}
