import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class RobotCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    resourceId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'robot 001',
    description: 'name of robot',
  })
    name: string;

  @ApiProperty({
    type: String,
    required: false,
  })
    description: string;
}
