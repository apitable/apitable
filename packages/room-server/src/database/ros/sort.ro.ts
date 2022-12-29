import { ApiProperty } from '@nestjs/swagger';
import { ApiTipConstant } from '@apitable/core';
import { IsDefined, IsEnum } from 'class-validator';
import { OrderEnum } from '../../shared/enums';
import { ISortRo } from '../../shared/interfaces';

export class SortRo implements ISortRo {
  @ApiProperty({
    type: String,
    required: false,
    example: 'fldAj8ZBpzj1X',
    description: 'Specify the field to sort',
  })
  @IsDefined({ message: ApiTipConstant.api_param_sort_field_not_exists })
    field: string;

  @ApiProperty({
    enum: OrderEnum,
    required: false,
    example: 'fldAj8ZBpzj1X',
    description: 'Specify the order type(asc/desc)',
  })
  @IsEnum(OrderEnum, {
    message: ApiTipConstant.api_params_invalid_order_sort,
  })
    order: OrderEnum;
}
