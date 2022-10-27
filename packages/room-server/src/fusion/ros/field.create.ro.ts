import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant, Field, FieldType, getFieldClass
  , getFieldTypeByString, getNewId, IAddOpenFieldProperty, IDPrefix, IField, IReduxState } from '@apitable/core';
import { IsDefined } from 'class-validator';

export class FieldCreateRo {

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }

  @ApiProperty({
    type: String,
    required: true,
    description: '字段名称',
    example: '名称'
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'name' }})
    name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '字段类型',
    example: ''
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'type' }})
    type: string;

  /** 字段配置 */
  @ApiPropertyOptional({
    type: Object,
    required: false,
    example: '',
    description: '属性',
  })
    property?: IAddOpenFieldProperty | null;

  transferToCommandData(): any{
    const fieldType = getFieldTypeByString(this.type as any)!;
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: this.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const property = fieldContext.addOpenFieldPropertyTransformProperty(this.property)||null;
    return { 
      data: {
        name: this.name, 
        type: fieldType,
        property, 
      }
    };
  }

  foreignDatasheetId(): string {
    const fieldType = getFieldTypeByString(this.type as any)!;
    if(fieldType === FieldType.Link && this.property) {
      return this.property['foreignDatasheetId'];
    }
    return null;
  }

}