import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant, FieldKeyEnum } from '@apitable/core';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { API_MAX_MODIFY_RECORD_COUNTS } from 'common';
import { FieldCreateRo } from './record.field.create.ro';

export class RecordCreateRo {
  @ApiProperty({
    type: [FieldCreateRo],
    required: true,
    description: '需要创建的的数据',
    example: [
      {
        fields: {
          事项: '「组织架构」模块 Organization Module - 通讯录面板的组织架构展示',
          问题描述: '本质上和上面的需求是同一个',
          分类: '产品需求',
          评审日期: '2019-10-30T00:00:00.000Z',
        },
      },
      {
        fields: {
          事项: '「成员」模块 - 设置所在部门',
          问题描述: '选择人后，可以调整他所属的多个部门\n选择部门后，也可添加成员至当前部门',
          分类: '产品需求',
          评审日期: '2019-10-29T16:00:00.000Z',
        },
      },
    ],
  })
  @Type(() => FieldCreateRo)
  @ArrayNotEmpty({ message: ApiTipConstant.api_params_records_empty_error })
  @ArrayMaxSize(API_MAX_MODIFY_RECORD_COUNTS, {
    message: ApiTipConstant.api_params_records_max_count_error,
    context: {
      count: API_MAX_MODIFY_RECORD_COUNTS,
    },
  })
  @ValidateNested()
    records: FieldCreateRo[];

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '【可选】，fields map 是由什么做 key。id 或者 name, 默认为 name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { message: ApiTipConstant.api_params_invalid_field_key })
    fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;
}
