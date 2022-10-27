import { object } from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class TriggerCreateRo {
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
    example: 'attxxxxxxx',
    description: 'trigger 原型 ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    triggerTypeId: string;

  @ApiProperty({
    type: object,
    required: false,
    example: '{}',
    description: 'trigger input 表单输入值',
  })
    input: object;
}
