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
  Cascader = 'Cascader',
  Button = 'Button',
  OneWayLink = 'OneWayLink',
  TwoWayLink = 'TwoWayLink',
  WorkDoc = 'WorkDoc',
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
