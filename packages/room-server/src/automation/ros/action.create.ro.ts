import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class ActionCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'arbxxxxxx',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    robotId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'aatxxxxxxx',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    actionTypeId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'aatxxxxxxx',
  })
    prevActionId: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: {},
  })
    input: object;
}
