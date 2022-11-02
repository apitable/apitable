import { FieldKeyEnum } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { API_MAX_MODIFY_RECORD_COUNTS } from 'shared/common';
import { ApiTipIdEnum } from 'shared/enums/string.enum';
import { FieldUpdateRo } from './record.field.update.ro';

export class RecordUpdateRo {
  @ApiProperty({
    type: [FieldUpdateRo],
    required: true,
    description: 'Need to modify the data corresponding column and data',
    example: [
      {
        recordId: 'recrHnjVuH6Fd',
        fields: {
          Currency: 5.53,
          Select: 'Select 1',
        },
      },
      {
        recordId: 'recwZ6yV3Srv3',
        fields: {
          Currency: 5.53,
          Select: 'Select 2',
        },
      },
    ],
  })
  @Type(() => FieldUpdateRo)
  @ArrayNotEmpty({ context: { tipId: ApiTipIdEnum.apiParamsEmptyError } })
  @ArrayMaxSize(API_MAX_MODIFY_RECORD_COUNTS, { context: { tipId: ApiTipIdEnum.apiParamsMaxCountError, value: API_MAX_MODIFY_RECORD_COUNTS } })
  @ValidateNested()
  records: FieldUpdateRo[];

  @ApiPropertyOptional({
    enum: FieldKeyEnum,
    description: '[Optional], what the fields map is made of key. id or name, default is name',
    default: FieldKeyEnum.NAME,
  })
  @IsEnum(FieldKeyEnum, { context: { tipId: ApiTipIdEnum.apiParamsInvalidValue } })
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
