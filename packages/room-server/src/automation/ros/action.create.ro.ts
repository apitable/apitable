import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class ActionCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'arbxxxxxx',
    description: '机器人ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    robotId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'aatxxxxxxx',
    description: 'action 原型 ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    actionTypeId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'aatxxxxxxx',
    description: '前一个 action Id',
  })
    prevActionId: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: {},
    description: 'action 输入值',
  })
    input: object;
}
