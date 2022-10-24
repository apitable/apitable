import { ApiProperty } from '@nestjs/swagger';
import { ApiTipConstant, Conversion } from '@apitable/core';
import { IsEnum, IsOptional } from 'class-validator';

export class FieldDeleteRo {

  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: ''
  })
  @IsOptional()
  @IsEnum(Conversion, { message: ApiTipConstant.api_params_invalid_value })
    conversion?: Conversion;

}