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

import {
  Field,
  FieldType,
  getFieldClass,
  getFieldTypeByString,
  getNewId,
  IAddFieldOptions,
  IAddOpenFieldProperty,
  IDPrefix,
  IField,
  IReduxState,
} from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FieldCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Field name',
    example: 'field name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Field type',
    example: '',
  })
  @IsString()
  type: string;

  /**
   * In Lookup field, `filterInfo.conditions[*].fieldType` is not required.
   */
  @ApiPropertyOptional({
    type: Object,
    required: false,
    example: '',
    description: 'Field property',
  })
  @IsOptional()
  property?: IAddOpenFieldProperty | null;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }

  transferToCommandData(): IAddFieldOptions {
    const fieldType = getFieldTypeByString(this.type as any)!;
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: this.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const property = fieldContext.addOpenFieldPropertyTransformProperty(this.property!) || null;
    return {
      data: {
        name: this.name,
        type: fieldType,
        property,
      },
      index: undefined as any,
    };
  }

  foreignDatasheetId(): string | null {
    const fieldType = getFieldTypeByString(this.type as any)!;
    if ((fieldType === FieldType.Link || fieldType === FieldType.OneWayLink) && this.property) {
      return this.property['foreignDatasheetId'];
    }
    return null;
  }
}
