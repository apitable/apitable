import { Field, FieldType, getFieldClass, getFieldTypeByString, getNewId, IDPrefix, IField, IReduxState } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { DatasheetFieldCreateRo } from './datasheet.field.create.ro';

export class DatasheetCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    description: 'datasheet name',
    example: 'New dataSheet',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'viwG9l1VPD6nH',
    description: 'datasheet description, plain text only',
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'fodn173Q0e8nC',
    description: 'folder Id, if not filled in, it is under the working directory',
  })
  folderId?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '',
    description: 'Previous node Id, or first if not filled in',
  })
  preNodeId?: string;

  @ApiPropertyOptional({
    type: [DatasheetFieldCreateRo],
    required: false,
    description: 'List of fields to be created',
    example: [
      {
        name: 'Title',
        type: 'TEXT',
        isPrimary: true,
      },
      {
        name: 'Options',
        type: 'SingleSelect',
        property: {
          options: [
            {
              name: 'abc',
            },
          ],
        },
      },
    ],
  })
  @IsOptional()
  // @ArrayMaxSize(200, { message: ApiTipConstant.api_params_max_count_error, context: { value: 200 }})
  @Type(() => DatasheetFieldCreateRo)
  @ValidateNested()
  fields?: DatasheetFieldCreateRo[];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  transferToCommandData(): any[] {
    const fields = [];
    if (this.fields) {
      this.fields.forEach(field => {
        const fieldType = getFieldTypeByString(field.type as any)!;
        const fieldInfo = {
          id: getNewId(IDPrefix.Field),
          name: field.name,
          type: fieldType,
          property: getFieldClass(fieldType).defaultProperty(),
        } as IField;
        const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
        const property = fieldContext.addOpenFieldPropertyTransformProperty(field.property) || null;
        fields.push({
          data: {
            name: field.name,
            type: fieldType,
            property,
          },
        });
      });
    }
    return fields;
  }

  foreignDatasheetIds(): string[] {
    const foreignDatasheetIds = [];
    if (this.fields) {
      this.fields.forEach(field => {
        const fieldType = getFieldTypeByString(field.type as any)!;
        if (fieldType === FieldType.Link && field.property) {
          foreignDatasheetIds.push(field.property['foreignDatasheetId']);
        }
      });
    }
    return foreignDatasheetIds;
  }
}
