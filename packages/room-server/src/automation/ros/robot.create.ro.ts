import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class RobotCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
    description: '资源ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    resourceId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '机器人001',
    description: '机器人名称',
  })
    name: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '我是机器人',
    description: '机器人描述',
  })
    description: string;
}
