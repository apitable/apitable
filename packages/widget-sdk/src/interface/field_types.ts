import { APIMetaFieldType as CoreFieldType, DateFormat, TimeFormat } from 'core';

/**
 * 维格表字段类型的枚举
 * ``` ts
 * import { FieldType } from '@vikadata/widget-sdk'
 * console.log(FieldType.Number)
 * ```
 * 
 * > tips: 通过 `getCellValue` 获取的值都支持写入单元格
 */
export enum FieldType {
  /**
   * 不支持类型
   */
  NotSupport = CoreFieldType.NotSupport,
  /**
   * 多行文本
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 写入单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  Text = CoreFieldType.Text,
  /**
   * 数字
   * 
   * ** 读取单元格值类型 **
   * 
   * `number`
   * 
   * ** 写入单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取字段配置类型 **
   * 
   * ```ts
   * {
   *  precision: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   *  symbol?: string; // 单位
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ``` ts
   * {
   *  precision: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   *  symbol?: string; // 单位
   * }
   * ```
   */
  Number = CoreFieldType.Number,
  /**
   * 单选
   * 
   * ** 读取单元格值类型 **
   * 
   * ``` ts
   * {
   *  id: string,
   *  name: string,
   *  color: {
   *    name: string, // 颜色名称
   *    value: string // 颜色的值
   *  }
   * }
   * ```
   * 
   * ** 写入单元格值类型 **
   * 
   * ``` ts
   * id: string | { id: string } | { name: string }
   * ```
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  options: {
   *    id: string; // 选项 ID
   *    name: string; // 选项名称
   *    color: {
   *      name: string;
   *      value: string;
   *    }; // 选项颜色
   *  }[];
   *  defaultValue?: string; // 默认值（选项ID）
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * 如果 option 不传 id 则会认为是需要新增选项
   * 
   * color 颜色表 [Color](/developers/widget/colors)
   * 
   * ``` ts
   * {
   *  options: {
   *    id?: string; // 选项 ID
   *    name: string; // 选项名称
   *    color?: string; // color name
   *  }
   *  defaultValue?: string; // 默认值（选项ID）
   * }
   * ```
   */
  SingleSelect = CoreFieldType.SingleSelect,
  /**
   * 多选
   * 
   * ** 读取单元格值类型 **
   * 
   * ``` ts
   * {
   *  id: string,
   *  name: string,
   *  color: {
   *    name: string,
   *    value: string
   *  }
   * }[]
   * ```
   * 
   * ** 写入单元格值类型 **
   * 
   * ``` ts
   * id: string[] | { id: string }[] | { name: string }[]
   * ```
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  options: {
   *    id: string; // 选项 ID
   *    name: string; // 选项名称
   *    color: {
   *      name: string;
   *      value: string;
   *    }; // 选项颜色
   *  }[];
   *  defaultValue?: string[]; // 默认值（选项ID）
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * 如果 option 不传 id 则会认为是需要新增选项
   * 
   * color 颜色表 [Color](/developers/widget/colors)
   * 
   * ``` ts
   * {
   *  options: {
   *    id?: string; // 选项 ID
   *    name: string; // 选项名称
   *    color?: string; // color name
   *  }
   *  defaultValue?: string[]; // 默认值（选项ID）
   * }
   * ```
   */
  MultiSelect = CoreFieldType.MultiSelect,
  /**
   * 日期
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 写入单元格值类型 **
   * 
   * `string | Date`
   * 
   * ** 读取字段配置类型 **
   * 
   * {@link DateFormat} {@link TimeFormat}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat; // 日期格式
   *  timeFormat?: TimeFormat; // 时间格式
   *  includeTime?: boolean, // 是否包含时间
   *  autoFill?: boolean // 新增记录时是否自动填入创建时间
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * {@link DateFormat} {@link TimeFormat}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat; // 日期格式
   *  timeFormat?: TimeFormat; // 时间格式
   *  includeTime?: boolean, // 是否包含时间
   *  autoFill?: boolean // 新增记录时是否自动填入创建时间
   * }
   * ```
   */
  DateTime = CoreFieldType.DateTime,
  /**
   * 附件
   * 
   * ** 读取单元格值类型 **
   * 
   * {@link IAttachmentValue}
   * 
   * ** 写入单元格值类型 **
   * 
   * 先调用官方API上传附件，得到相应数据之后写入
   * 
   * {@link IAttachmentValue}
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  Attachment = CoreFieldType.Attachment,
  /**
   * 神奇关联
   * 
   * ** 读取单元格值类型 **
   * 
   * ``` ts
   * {
   *  recordId: string,
   *  title: string
   * }[]
   * ```
   * 
   * ** 写入单元格值类型 **
   * 
   * `recordId[]`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  foreignDatasheetId: string; // 关联的表格ID
   *  brotherFieldId?: string; // 关联表的列ID
   *  limitToView?: string; // 限制只在对应 viewId 可选 record
   *  limitSingleRecord?: boolean; // 是否限制只允许关联一条阻断
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * 当更新神奇关联字段的关联表格ID的时候，对于关联表格对应的关联字段的处理方式
   * {@link Conversion}
   * 
   * ``` ts
   * {
   *  foreignDatasheetId: string; // 关联的表格ID
   *  limitToView?: string; // 限制只在对应 viewId 可选 record
   *  limitSingleRecord?: boolean; // 是否限制只允许关联一条阻断
   *  conversion?: Conversion;
   * }
   * ```
   */
  MagicLink = CoreFieldType.MagicLink,
  /**
   * 网址
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 写入单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  URL = CoreFieldType.URL,
  /**
   * 邮箱
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 写入单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  Email = CoreFieldType.Email,
  /**
   * 电话
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 写入单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  Phone = CoreFieldType.Phone,
  /**
   * 勾选
   * 
   * ** 读取单元格值类型 **
   * 
   * `boolean`
   * 
   * ** 写入单元格值类型 **
   * 
   * `boolean`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  icon: string; // Emoji slug
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * icon Emoji 配置表 [Emojis](/developers/widget/emojis)
   * 
   * ``` ts
   * {
   *  icon: 'white_check_mark' | 'ballot_box_with_check'; // icon name
   * }
   * ```
   * 
   */
  Checkbox = CoreFieldType.Checkbox,
  /**
   * 评分
   * 
   * ** 读取单元格值类型 **
   * 
   * `number`
   * 
   * ** 写入单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取字段配置类型 **
   * 
   * ```ts
   * {
   *  max: number; // 最大值 1 - 10
   *  icon: string; // Emoji slug
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * icon Emoji 配置表 [Emojis](/developers/widget/emojis)
   * 
   * ```ts
   * {
   *  max: number; // 最大值 1 - 10
   *  icon: 'star' | 'star2' | 'stars'; // icon name
   * }
   * ```
   * 
   */
  Rating = CoreFieldType.Rating,
  /**
   * 成员
   * 
   * ** 读取单元格值类型 **
   * 
   * ``` ts
   * {
   *  id: string, // 成员ID
   *  type: 'Team' | 'Member', // 成员类型
   *  name: string, // 成员名称
   *  avatar?: string, // 成员头像
   * }[]
   * ```
   * 
   * ** 写入单元格值类型 **
   * 
   * `id: string[]`
   * 
   * ** 读取字段配置类型 **
   * 
   * ```ts
   * {
   *  isMulti: boolean; // 可选单个或者多个成员
   *  shouldSendMsg: boolean; // 选择成员后是否发送消息通知
   *  options: [
   *    id: string, // 成员ID
   *    type: 'Team' | 'Member', // 成员类型
   *    name: string, // 成员名称
   *    avatar?: string, // 成员头像
   *  ]; // 已选成员
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ```ts
   * {
   *  isMulti?: boolean; // 可选单个或者多个成员；默认为true
   *  shouldSendMsg?: boolean; // 选择成员后是否发送消息通知；默认为true
   * }
   * ```
   */
  Member = CoreFieldType.Member,
  /**
   * * 神奇引用
   * 
   * ** 读取单元格值类型 **
   * 
   * `(read cell value)[]` 引用的源字段的 cellValue 数组
   * 
   * 至多是二维数组，如果引用的源字段的 cellValue 是数组就是二维数组，如果不是则为一维数组
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取字段配置类型 **
   * 
   * {@link BasicValueType}
   * 
   * {@link RollUpFuncType}
   * 
   * ```ts
   * {
   *  relatedLinkFieldId: string; // 引用的当前表的关联字段 ID
   *  targetFieldId: string; // 关联表中查询的字段 ID
   *  hasError?: boolean; // 当神奇引用的依赖的关联字段被删除或者转化类型时，可能无法正常获取引用值
   *  entityField?: {
   *    datasheetId: string;
   *    field: IAPIMetaField;
   *  }; // 最终引用到的实体字段，不包含神奇引用类型的字段。存在错误时，实体字段可能不存在。
   *  rollupFunction?: RollUpFuncType; // 汇总函数
   *  valueType?: BasicValueType; // 返回值类型，取值包括 String、Boolean、Number、DateTime、Array
   *  // 根据被引用字段的类型可以自定义格式，如 日期、数字、百分比、货币字段
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency', 
   *    format: Format
   *  };
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * {@link RollUpFuncType}
   * 
   * ```ts
   * {
   *  relatedLinkFieldId: string; // 引用的当前表的关联字段 ID
   *  targetFieldId: string; // 关联表中查询的字段 ID
   *  rollupFunction?: RollUpFuncType; // 汇总函数
   *  // 根据被引用字段的类型可以自定义格式，如 日期、数字、百分比、货币字段，具体format 参考对应字段写入属性
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency', 
   *    format: Format
   *  };
   * }
   * ```
   */
  MagicLookUp = CoreFieldType.MagicLookUp,
  /**
   * 公式
   * 
   * ** 读取单元格值类型 **
   * 
   * `null | string | number | boolean | string[] | number[] | boolean`
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取字段配置类型 **
   * 
   * {@link BasicValueType}
   * ```ts
   * {
   *  valueType: BasicValueType; // 返回值类型，取值包括 String、Boolean、Number、DateTime、Array
   *  expression: string; // 公式表达式
   *  hasError: boolean; // 当公式依赖的相关字段被删除或者转化类型时，可能无法正常获取计算值
   *  // 根据被引用字段的类型可以自定义格式，如 日期、数字、百分比、货币字段，具体format 参考对应字段写入属性
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency', 
   *    format: Format
   *  };
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ```ts
   * {
   *  expression?: string; // 公式表达式
   *  // 根据被引用字段的类型可以自定义格式，如 日期、数字、百分比、货币字段，具体format 参考对应字段写入属性
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency', 
   *    format: Format
   *  };
   * }
   * ```
   */
  Formula = CoreFieldType.Formula,
  /**
   * 货币
   * 
   * ** 写入单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  symbol?: string; // 单位
   *  precision?: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   *  symbolAlign?: 'Default' | 'Left' | 'Right'; // 单位的排列
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ``` ts
   * {
   *  symbol?: string; // 单位
   *  precision?: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   *  symbolAlign?: 'Default' | 'Left' | 'Right'; // 单位的排列
   * }
   * ```
   */
  Currency = CoreFieldType.Currency,
  /**
   * 百分比
   * 
   * ** 写入单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  precision: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ``` ts
   * {
   *  precision: number; // 保留小数位
   *  defaultValue?: string; // 默认值
   * }
   * ```
   */
  Percent = CoreFieldType.Percent,
  /**
   * 单行文本
   * 
   * ** 写入单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  defaultValue?: string
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ``` ts
   * {
   *  defaultValue?: string
   * }
   * ```
   */
  SingleText = CoreFieldType.SingleText,
  /**
   * 自增数字
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取单元格值类型 **
   * 
   * `number`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   * 
   */
  AutoNumber = CoreFieldType.AutoNumber,
  /**
   * 创建时间
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * {@link DateFormat}
   * 
   * {@link TimeFormat}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime?: boolean, // 是否包含时间
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * {@link DateFormat}
   * 
   * {@link TimeFormat}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime?: boolean, // 是否包含时间
   * }
   * ```
   * 
   */
  CreatedTime = CoreFieldType.CreatedTime,
  /**
   * 修改时间
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * {@link DateFormat}
   * 
   * {@link TimeFormat}
   * 
   * {@link CollectType}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime: boolean; // 是否包含时间
   *  collectType: CollectType; // 指定字段类型：0 所有可编辑，1 指定字段
   *  fieldIdCollection: string[]; // 是否指定字段，数组类型可指定多个字段，不填为所有
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * {@link DateFormat}
   * 
   * {@link TimeFormat}
   * 
   * {@link CollectType}
   * 
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime?: boolean; // 是否包含时间
   *  collectType?: CollectType; // 指定字段类型：0 所有可编辑，1 指定字段
   *  fieldIdCollection?: string[]; // 是否指定字段，数组类型可指定多个字段，不填为所有
   * }
   * ```
   * 
   */
  LastModifiedTime = CoreFieldType.LastModifiedTime,
  /**
   * 创建人
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * 无
   * 
   * ** 写入字段配置类型 **
   * 
   * 无
   *  
   */
  CreatedBy = CoreFieldType.CreatedBy,
  /**
   * 修改人
   * 
   * ** 写入单元格值类型 **
   * 
   * 无
   * 
   * ** 读取单元格值类型 **
   * 
   * `string`
   * 
   * ** 读取字段配置类型 **
   * 
   * ``` ts
   * {
   *  collectType?: CollectType; // 指定字段类型：0 所有可编辑，1 指定字段
   *  fieldIdCollection?: string[]; // 是否指定字段，数组类型可指定多个字段，不填为所有
   * }
   * ```
   * 
   * ** 写入字段配置类型 **
   * 
   * ``` ts
   * {
   *  collectType?: CollectType; // 指定字段类型：0 所有可编辑，1 指定字段
   *  fieldIdCollection?: string[]; // 是否指定字段，数组类型可指定多个字段，不填为所有
   * }
   * ```

   * 
   */
  LastModifiedBy = CoreFieldType.LastModifiedBy
}

export interface IAttachmentValue {
  /** id 用来做 follow key，目前和 attachmentToken 一样 */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件的 mime 类型 */
  mimeType: string;
  /** 文件上传到后端 token，最终地址通过前端组装来访问。 */
  token: string;
  /** 存储位置，后端返回 */
  bucket: string;
  /** 文件大小，后端返回 byte */
  size: number;
  width?: number;
  height?: number;
  /** 预览地址（pdf 之类文件） */
  preview?: string;
  /** 文件的完整地址 */
  url: string;
  /** 预览的完整地址 */
  previewUrl?: string;
}

export interface IDateTimeFieldPropertyFormat {
  /** 日期格式 */
  dateFormat: DateFormat;
  /** 时间格式 */
  timeFormat: TimeFormat;
  /** 是否包含时间 */
  includeTime: boolean;
}

/**
 * 计算字段返回值为 number 时候，数字类型字段格式化
 */
export interface INumberBaseFieldPropertyFormat {
  /**
   * 数字的格式化类型
   */
  formatType: 'currency' | 'number' | 'datetime' | 'percent';
  /** 保留小数位 */
  precision: number;
  /** 单位 */
  symbol?: string;
}

/**
 * fieldType 的枚举值
 */
export enum NumFieldType {
  NotSupport = 0,
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  DateTime = 5,
  Attachment = 6,
  Link = 7,
  URL = 8,
  Email = 9,
  Phone = 10,
  Checkbox = 11,
  Rating = 12,
  Member = 13,
  LookUp = 14,
  // RollUp = 15,
  Formula = 16,
  Currency = 17,
  Percent = 18,
  SingleText = 19,
  AutoNumber = 20,
  CreatedTime = 21,
  LastModifiedTime = 22,
  CreatedBy = 23,
  LastModifiedBy = 24,
  DeniedField = 999, // 无权限列
}
