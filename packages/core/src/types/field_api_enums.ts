export enum APIMetaFieldType {
  NotSupport = 'NotSupport',
  Text = 'Text',
  Number = 'Number',
  SingleSelect = 'SingleSelect',
  MultiSelect = 'MultiSelect',
  DateTime = 'DateTime',
  Attachment = 'Attachment',
  MagicLink = 'MagicLink',
  URL = 'URL',
  Email = 'Email',
  Phone = 'Phone',
  Checkbox = 'Checkbox',
  Rating = 'Rating',
  Member = 'Member',
  MagicLookUp = 'MagicLookUp',
  // RollUp = 'RollUp',
  Formula = 'Formula',
  Currency = 'Currency',
  Percent = 'Percent',
  SingleText = 'SingleText',
  AutoNumber = 'AutoNumber',
  CreatedTime = 'CreatedTime',
  LastModifiedTime = 'LastModifiedTime',
  CreatedBy = 'CreatedBy',
  LastModifiedBy = 'LastModifiedBy',
}

export enum APIMetaViewType {
  Grid = 'Grid',
  Gallery = 'Gallery',
  Kanban = 'Kanban',
  Gantt = 'Gantt',
  Calendar = 'Calendar',
  Architecture = 'Architecture'
}

export enum APIMetaMemberType {
  Team = 'Team',
  Member = 'Member',
}

/**
 * Field Meta 描述单元格数据。可以读列，即可以读单元格，单元格权限和列权限强相关。
 * 权限等级： Manage > Edit > Read
 */
export enum APIMetaFieldPermissionLevel {
  Read = 'Read', // 读单元格
  Edit = 'Edit', // 写单元格
  Manage = 'Manage', // 管理列
}

export enum APIMetaFieldPropertyFormatEnums {
  DateTime = 'DateTime',
  Number = 'Number',
  Percent = 'Percent',
  Currency = 'Currency',
}

export enum TSymbolAlign {
  Default = 'Default',
  Left = 'Left',
  Right = 'Right'
}