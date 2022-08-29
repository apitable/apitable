import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldUpdateRo } from './record.field.update.ro';
import { Expose, Type } from 'class-transformer';
import { FieldKeyEnum } from '@vikadata/core';
import { ArrayMaxSize, ArrayNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { API_MAX_MODIFY_RECORD_COUNTS } from 'common';
import { ApiTipIdEnum } from 'enums/string.enum';

export class RecordUpdateRo {
  @ApiProperty({
    type: [FieldUpdateRo],
    required: true,
    description: '需要修改记录的数据对应列和数据',
    example: [
      {
        recordId: 'recrHnjVuH6Fd',
        fields: {
          货币: 5.53,
          单选: '单选1',
        },
      },
      {
        recordId: 'recwZ6yV3Srv3',
        fields: {
          货币: 5.53,
          单选: '单选2',
        },
      },
    ],
  })
  @Type(() => FieldUpdateRo)
  @ArrayNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError }})
  @ArrayMaxSize(API_MAX_MODIFY_RECORD_COUNTS, { context: { tipId: ApiTipIdEnum.apiParamsMaxCountError, value: API_MAX_MODIFY_RECORD_COUNTS }})
  @ValidateNested()
    records: FieldUpdateRo[];

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '【可选】，fields map 是由什么做 key。id 或者 name, 默认为 name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { context: { tipId: ApiTipIdEnum.apiParamsInvalidValue }})
    fieldKey: FieldKeyEnum = FieldKeyEnum.NAME;

  @Expose()
  getRecordIds() {
    if (this.records) {
      return this.records.reduce<string[]>((pre, cur) => {
        pre.push(cur.recordId);
        return pre;
      }, []);
    }
    return null;
  }
}
