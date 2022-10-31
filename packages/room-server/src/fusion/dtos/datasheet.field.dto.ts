import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { FieldPermissionEnum, FieldTypeTextEnum } from 'shared/enums/field.type.enum';
import { IApiDatasheetField } from '../../shared/interfaces';
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
} from 'fusion/dtos/field.property.dto';

export class DatasheetFieldDto implements IApiDatasheetField {
  @ApiProperty({
    type: String,
    example: 'fldsRHWJZwFcM',
    description: 'field ID',
  })
    id: string;

  @ApiProperty({
    type: String,
    description: 'field name',
    example: 'order id',
  })
    name: string;

  @ApiProperty({
    enum: FieldTypeTextEnum,
    description: 'field type',
    example: FieldTypeTextEnum.SingleText,
  })
    type: FieldTypeTextEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'field description',
    example: 'do not change it, it was generated automatically',
  })
    desc?: string;

  @ApiPropertyOptional({
    description: 'field property',
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
    example: '{"defaultValue":"to be added"}',
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
    description: 'user permission type of this field',
    example: FieldPermissionEnum.Edit,
  })
    permissionLevel?: FieldPermissionEnum;
}
