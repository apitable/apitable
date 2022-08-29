import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';
import { ApiTipIdEnum } from 'enums/string.enum';

export class RecordHistoryQueryRo {

  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: 0,
    description: '动态类型0: 全部, 1: 修改历史, 2: 评论, 默认全部',
  })
  @Type(() => Number)
  @IsIn([0, 1, 2], { context: { tipId: ApiTipIdEnum.apiParamsInvalidValue }})
    type = 0;

  @ApiPropertyOptional({
    type: Number,
    example: 14,
    description: '限制天数，默认14，最大730天',
  })
  @Type(() => Number)
  @Max(730, { context: { tipId: ApiTipIdEnum.apiParamsMaxError, value: 730 }})
    limitDays = 14;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 10,
    description: '指定每页返回的记录总数，缺省值为10。此参数只接受1-100的整数',
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { context: { tipId: ApiTipIdEnum.apiParamsMinError }})
  @Max(100, { context: { tipId: ApiTipIdEnum.apiParamsMaxError, value: 100 }})
    pageSize = 10;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: '（选填）指定当前最大版本号，返回小于版本号的的记录,不填为最大版本号',
  })
  // 为了参数验证
  @Type(() => Number)
  @IsOptional()
  @Min(1, { context: { tipId: ApiTipIdEnum.apiParamsMinError }})
    maxRevision: string;

}
