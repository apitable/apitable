import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BasicValueType, RollUpFuncType } from '@apitable/core';
import { ExtraModel } from '../../shared/common';
import { UnitTypeTextEnum } from '../../shared/enums';
import { DatasheetFieldDto } from 'fusion/dtos/datasheet.field.dto';

class MemberProperty {
  @ApiProperty({
    type: String,
    example: '1217029313010270209',
    description: '成员 id',
  })
    id: string;

  @ApiProperty({
    type: String,
    example: '张三',
    description: '成员名称',
  })
    name: string;

  @ApiProperty({
    enum: UnitTypeTextEnum,
    example: UnitTypeTextEnum.Member,
    description: '组织类型 member、team',
  })
    type: UnitTypeTextEnum;

  @ApiPropertyOptional({
    type: String,
    example: 'https://s1.vika.cn/default/avatar001.jpg',
    description: '头像',
  })
    avatar?: string;
}

class UserProperty {
  @ApiProperty({
    type: String,
    example: 'eeb620a54e2248c69c25de68e6eb668c',
    description: '用户 id \n 特殊ID：\n Anonymous: 匿名者，未登录用户创建或更新记录 \n Bot: 机器人',
  })
    id: string;

  @ApiProperty({
    type: String,
    example: '张三',
    description: '用户名称',
  })
    name: string;

  @ApiProperty({
    type: String,
    example: 'https://s1.vika.cn/default/avatar001.jpg',
    description: '头像',
  })
    avatar: string;
}

class DatasheetField {
  @ApiProperty({
    type: String,
    example: 'dstxxxxxxx',
    description: '引用表 ID',
  })
    datasheetId: string;

  @ApiProperty({
    type: () => DatasheetFieldDto,
    description: '引用字段',
    example:
      '{"id": "fldsRHWJZwFcM","name": "单号","type": "SingleText","desc": "这一列是自动生成的单号，不要手动修改",' +
      '"property": {"defaultValue": "待补充"},"permissionLevel": "edit" }',
  })
    field: DatasheetFieldDto;
}

class SingleSelectProperty {
  @ApiProperty({
    type: String,
    example: 'opt8QSSURh52T',
    description: '选项 ID',
  })
    id: string;

  @ApiProperty({
    type: String,
    example: '科幻',
    description: '选项名称',
  })
    name: string;

  @ApiProperty({
    type: Object,
    example: '{"name":"red_0", "value":"#ff0000"}',
    description: '选项颜色',
  })
    color: Object;
}

@ApiExtraModels(ExtraModel)
export class SingleTextPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: '待补充',
    description: '新建记录时，此字段的默认值',
  })
    defaultValue?: string;
}

@ApiExtraModels(ExtraModel)
export class NumberFieldPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: '待补充',
    description: '新建记录时，此字段的默认值',
  })
    defaultValue?: string;

  @ApiProperty({
    type: Number,
    example: 2,
    description: '数字展示精度 0-4',
  })
    precision: number;
}

@ApiExtraModels(ExtraModel)
export class CurrencyFieldPropertyDto extends NumberFieldPropertyDto {
  @ApiPropertyOptional({
    type: String,
    example: '$',
    description: '货币符号，可以自定义的任意字符',
  })
    symbol?: string;
}

@ApiExtraModels(ExtraModel)
export class SelectFieldPropertyDto {
  @ApiProperty({
    type: [SingleSelectProperty],
    description: '单选字段属性',
  })
    options: SingleSelectProperty[];
}

@ApiExtraModels(ExtraModel)
export class MemberFieldPropertyDto {
  @ApiProperty({
    type: [MemberProperty],
    description: '成员字段属性',
  })
    options: MemberProperty[];
}

@ApiExtraModels(ExtraModel)
export class UserPropertyDto {
  @ApiProperty({
    type: [UserProperty],
    description: 'CreateBy｜LastModifiedBy字段属性',
  })
    options: UserProperty[];
}

@ApiExtraModels(ExtraModel)
export class CheckboxFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: '✅',
    description: 'emoji 字符',
  })
    icon: string;
}

@ApiExtraModels(ExtraModel)
export class RatingFieldPropertyDto extends CheckboxFieldPropertyDto {
  @ApiProperty({
    type: Number,
    example: 5,
    description: '评分最大值 1-10',
  })
    max: number;
}

@ApiExtraModels(ExtraModel)
export class DateTimeFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'YYYY/MM/DD HH:mm',
    description:
      '日期格式 ' +
      '\n 日期字段的值会返回时间戳, 不限制格式。字段属性中 format 信息可用于格式化, 含义参见 dayjs format' +
      '\n 如果你不想处理日期格式化，希望返回结果和视图展示内容保持一致，可以在查询参数中赋值 cellFormat 为 string, 则返回的内容全部为字符串',
  })
    format: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: '新建记录时，是否自动填充时间',
  })
    autoFill: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: '是否显示时间',
  })
    includeTime: boolean;
}

@ApiExtraModels(ExtraModel)
export class LinkFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'dstg3kerxz9DYzGjvs',
    description: '关联表 ID',
  })
    foreignDatasheetId: string;

  @ApiProperty({
    type: String,
    example: 'fidxxxxxxx',
    description: '关联表中兄弟字段 ID',
  })
    brotherFieldId: string;
}

@ApiExtraModels(ExtraModel)
export class LookupFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: 'fidxxxxxxx',
    description: '引用依附的关联字段 ID',
  })
    relatedLinkFieldId: string;

  @ApiProperty({
    type: DatasheetField,
    description: '引用字段',
  })
    targetField: DatasheetField;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: '当神奇引用的依赖的关联字段被删除或者转化类型时，可能无法正常获取引用值',
  })
    hasError?: boolean;

  @ApiPropertyOptional({
    type: DatasheetField,
    description: '最终引用到的实体字段，不包含 lookup 类型的字段。存在错误时，实体字段可能不存在。',
  })
    entityField?: DatasheetField;

  @ApiProperty({
    enum: RollUpFuncType,
    example: RollUpFuncType.VALUES,
    description: '汇总函数',
  })
    rollupFunction: RollUpFuncType;

  @ApiProperty({
    enum: BasicValueType,
    example: BasicValueType.String,
    description: '返回值类型 String,Boolean,Number,DateTime,Array',
  })
    valueType: BasicValueType;
}

@ApiExtraModels(ExtraModel)
export class FormulaFieldPropertyDto {
  @ApiProperty({
    type: String,
    example: '{fidxxxxxx}',
    description: '公式表达式',
  })
    expression: string;

  @ApiProperty({
    enum: BasicValueType,
    example: BasicValueType.String,
    description: '返回值类型 String,Boolean,Number,DateTime,Array',
  })
    valueType: BasicValueType;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: '当神奇引用的依赖的关联字段被删除或者转化类型时，可能无法正常获取引用值',
  })
    hasError?: boolean;
}
