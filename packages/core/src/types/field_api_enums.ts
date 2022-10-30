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
  * Field Meta describes cell data. Columns can be read, that is, cells can be read. Cell permissions and column permissions are strongly related.
  * Permission level: Manage > Edit > Read
  */
export enum APIMetaFieldPermissionLevel {
  Read = 'Read', // read cell
  Edit = 'Edit', // write cell
  Manage = 'Manage', // Manage columns
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