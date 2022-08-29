import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { FieldPermissionEnum, FieldTypeTextEnum } from 'enums/field.type.enum';
import { IApiDatasheetField } from 'interfaces';
import {
  CheckboxFieldPropertyDto,
  CurrencyFieldPropertyDto,
  DateTimeFieldPropertyDto,
  FormulaFieldPropertyDto,
  LinkFieldPropertyDto,
  LookupFieldPropertyDto,
  MemberFieldPropertyDto,
  NumberFieldPropertyDto,
  RatingFieldPropertyDto,
  SelectFieldPropertyDto,
  SingleTextPropertyDto,
  UserPropertyDto,
} from 'model/dto/fusion/field.property.dto';

export class DatasheetFieldDto implements IApiDatasheetField {
  @ApiProperty({
    type: String,
    example: 'fldsRHWJZwFcM',
    description: '字段 ID',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: '字段名称',
    example: '单号',
  })
    name: string;

  @ApiProperty({
    enum: FieldTypeTextEnum,
    description: '字段类型',
    example: FieldTypeTextEnum.SingleText,
  })
    type: FieldTypeTextEnum;

  @ApiPropertyOptional({
    type: String,
    description: '字段描述',
    example: '这一列是自动生成的单号，不要手动修改',
  })
    desc?: string;

  @ApiPropertyOptional({
    description: '字段专有属性',
    oneOf: [
      { $ref: getSchemaPath(SingleTextPropertyDto) },
      { $ref: getSchemaPath(NumberFieldPropertyDto) },
      { $ref: getSchemaPath(CurrencyFieldPropertyDto) },
      { $ref: getSchemaPath(SelectFieldPropertyDto) },
      { $ref: getSchemaPath(MemberFieldPropertyDto) },
      { $ref: getSchemaPath(UserPropertyDto) },
      { $ref: getSchemaPath(CheckboxFieldPropertyDto) },
      { $ref: getSchemaPath(RatingFieldPropertyDto) },
      { $ref: getSchemaPath(DateTimeFieldPropertyDto) },
      { $ref: getSchemaPath(LinkFieldPropertyDto) },
      { $ref: getSchemaPath(LookupFieldPropertyDto) },
      { $ref: getSchemaPath(FormulaFieldPropertyDto) },
    ],
    example: '{"defaultValue":"待补充"}',
  })
    property?:
    | SingleTextPropertyDto
    | NumberFieldPropertyDto
    | CurrencyFieldPropertyDto
    | SelectFieldPropertyDto
    | MemberFieldPropertyDto
    | UserPropertyDto
    | CheckboxFieldPropertyDto
    | RatingFieldPropertyDto
    | DateTimeFieldPropertyDto
    | LinkFieldPropertyDto
    | LookupFieldPropertyDto
    | FormulaFieldPropertyDto;

  @ApiPropertyOptional({
    enum: FieldPermissionEnum,
    description: '用户对当前字段的权限',
    example: FieldPermissionEnum.Edit,
  })
    permissionLevel?: FieldPermissionEnum;
}
