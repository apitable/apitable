import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant, Field, FieldType, getFieldClass, getFieldTypeByString, getNewId, IDPrefix, IField, IReduxState } from '@apitable/core';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { DatasheetFieldCreateRo } from './datasheet.field.create.ro';

export class DatasheetCreateRo {

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  @ApiProperty({
    type: String,
    required: true,
    description: '表格名称',
    example: '新建表格'
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_error, context: { property: 'datasheet', value: 'name' }})
    name: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'viwG9l1VPD6nH',
    description: '表格描述，仅支持纯文本',
  })
    description: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'fodn173Q0e8nC',
    description: '文件夹ID，如不填则为工作目录下',
  })
    folderId?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '',
    description: '前一个节点ID，如不填则为首位',
  })
    preNodeId?: string;

  @ApiPropertyOptional({
    type: [DatasheetFieldCreateRo],
    required: false,
    description: '需要创建的字段列表',
    example: [{
      name: '标题',
      type: 'TEXT',
      isPrimary: true
    },{
      name: '选项',
      type: 'SingleSelect',
      property: {
        options: [{
          name: 'abc'
        }]
      }
    }],
  })
  @IsOptional()
  // @ArrayMaxSize(200, { message: ApiTipConstant.api_params_max_count_error, context: { value: 200 }})
  @Type(() => DatasheetFieldCreateRo)
  @ValidateNested()
    fields?: DatasheetFieldCreateRo[];

  transferToCommandData(): any[]{
    const fields = [];
    if(this.fields) {
      this.fields.forEach(field => {
        const fieldType = getFieldTypeByString(field.type as any)!;
        const fieldInfo = {
          id: getNewId(IDPrefix.Field),
          name: field.name,
          type: fieldType,
          property: getFieldClass(fieldType).defaultProperty(),
        } as IField;
        const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
        const property = fieldContext.addOpenFieldPropertyTransformProperty(field.property)||null;
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
    if(this.fields) {
      this.fields.forEach(field => { 
        const fieldType = getFieldTypeByString(field.type as any)!;
        if(fieldType === FieldType.Link && field.property) {
          foreignDatasheetIds.push(field.property['foreignDatasheetId']);
        }
      });
    }
    return foreignDatasheetIds;
  }

}