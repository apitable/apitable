import {
  Field,
  FieldType,
  getFieldClass,
  getFieldTypeByString,
  getNewId,
  IAddOpenFieldProperty,
  IDPrefix,
  IField,
  IReduxState,
} from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FieldCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Field name',
    example: 'field name',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Field type',
    example: '',
  })
  type: string;

  @ApiPropertyOptional({
    type: Object,
    required: false,
    example: '',
    description: 'Field property',
  })
  property?: IAddOpenFieldProperty | null;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }

  transferToCommandData(): any {
    const fieldType = getFieldTypeByString(this.type as any)!;
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: this.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const property = fieldContext.addOpenFieldPropertyTransformProperty(this.property) || null;
    return {
      data: {
        name: this.name,
        type: fieldType,
        property,
      },
    };
  }

  foreignDatasheetId(): string {
    const fieldType = getFieldTypeByString(this.type as any)!;
    if (fieldType === FieldType.Link && this.property) {
      return this.property['foreignDatasheetId'];
    }
    return null;
  }
}
