import { ApiTipConstant } from '@apitable/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class RecordHistoryQueryRo {
  @ApiPropertyOptional({
    type: Number,
    required: true,
    example: 0,
    description: 'type(0: All, 1: History, 2: Comment), default: 0',
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2], { message: ApiTipConstant.api_params_invalid_value })
  type = 0;

  @ApiPropertyOptional({
    type: Number,
    example: 14,
    description: 'Limited days, default is 14, maximum is 730 days',
  })
  @IsOptional()
  @Type(() => Number)
  @Max(730, { message: ApiTipConstant.api_params_max_error, context: { value: 730 } })
  limitDays = 14;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 10,
    description: 'The total number of records returned per page is 10. This parameter only accepts an integer of 1-100',
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_min_error, context: {} })
  @Max(100, { message: ApiTipConstant.api_params_max_error, context: { value: 100 } })
  pageSize = 10;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description:
      '(Optional) Specify the current largest revision, return the record witch is smaller than the revision, ' +
      'and default is the largest revision',
  })
  // For parameter validation
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_min_error, context: {} })
  maxRevision: string;
}
