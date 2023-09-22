/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Field, FieldType, getFieldClass, getFieldTypeByString, getNewId, IAddFieldOptions, IDPrefix, IField, IReduxState } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { DatasheetFieldCreateRo } from './datasheet.field.create.ro';

export class DatasheetCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    description: 'datasheet name',
    example: 'New dataSheet',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'viwG9l1VPD6nH',
    description: 'datasheet description, plain text only',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'fodn173Q0e8nC',
    description: 'folder Id, if not filled in, it is under the working directory',
  })
  @IsString()
  @IsOptional()
  folderId?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '',
    description: 'Previous node Id, or first if not filled in',
  })
  @IsString()
  @IsOptional()
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

  transferToCommandData(): IAddFieldOptions[] {
    const fields: any[] = [];
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
        const property = fieldContext.addOpenFieldPropertyTransformProperty(field.property!) || null;
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
    const foreignDatasheetIds: string[] = [];
    if (this.fields) {
      this.fields.forEach(field => {
        const fieldType = getFieldTypeByString(field.type as any)!;
        if ((fieldType === FieldType.Link || fieldType === FieldType.OneWayLink) && field.property) {
          foreignDatasheetIds.push(field.property['foreignDatasheetId']);
        }
      });
    }
    return foreignDatasheetIds;
  }
}
