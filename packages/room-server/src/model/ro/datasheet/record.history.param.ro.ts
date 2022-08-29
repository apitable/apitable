import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiTipIdEnum } from 'enums/string.enum';

export class RecordHistoryParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dst0Yj5aNeoHldqvf6',
    description: '维格表ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    dstId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'rec0Yj5aNeoHldqvf6',
    description: '维格表记录ID',
  })
  @IsNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
    recId: string;
}
