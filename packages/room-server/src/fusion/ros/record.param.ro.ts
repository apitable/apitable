import { ApiProperty } from '@nestjs/swagger';

export class RecordParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
    description: 'datasheet Id',
  })
  datasheetId: string;
}
