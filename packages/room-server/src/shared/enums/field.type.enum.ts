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

import { FieldType } from '@apitable/core';
import Enum from './enum';

export {
  APIMetaViewType as ViewTypeTextEnum,
  APIMetaFieldPermissionLevel as FieldPermissionEnum,
  APIMetaFieldType as FieldTypeTextEnum,
} from '@apitable/core';

export const FieldTypeEnum = new Enum([
  { key: 'NotSupport', name: 'NotSupportField', value: FieldType.NotSupport },
  { key: 'Text', name: 'TextField', value: FieldType.Text },
  { key: 'Number', name: 'NumberField', value: FieldType.Number },
  { key: 'SingleSelect', name: 'SingleSelectField', value: FieldType.SingleSelect },
  { key: 'MultiSelect', name: 'MultiSelectField', value: FieldType.MultiSelect },
  { key: 'DateTime', name: 'DateTimeField', value: FieldType.DateTime },
  { key: 'Attachment', name: 'AttachmentField', value: FieldType.Attachment },
  { key: 'Link', name: 'LinkField', value: FieldType.Link },
  { key: 'URL', name: 'UrlField', value: FieldType.URL },
  { key: 'Email', name: 'EmailField', value: FieldType.Email },
  { key: 'Phone', name: 'PhoneField', value: FieldType.Phone },
  { key: 'Checkbox', name: 'CheckboxField', value: FieldType.Checkbox },
  { key: 'Rating', name: 'RatingField', value: FieldType.Rating },
  { key: 'Member', name: 'MemberField', value: FieldType.Member },
  { key: 'LookUp', name: 'LookUpField', value: FieldType.LookUp },
  // RollUp = 15,
  { key: 'Formula', name: 'FormulaField', value: FieldType.Formula },
  { key: 'Currency', name: 'CurrencyField', value: FieldType.Currency },
  { key: 'Percent', name: 'PercentField', value: FieldType.Percent },
  { key: 'SingleText', name: 'SingleTextField', value: FieldType.SingleText },
  { key: 'AutoNumber', name: 'AutoNumberField', value: FieldType.AutoNumber },
  { key: 'CreatedTime', name: 'CreatedTimeField', value: FieldType.CreatedTime },
  { key: 'LastModifiedTime', name: 'LastModifiedTimeField', value: FieldType.LastModifiedTime },
  { key: 'CreatedBy', name: 'CreatedByField', value: FieldType.CreatedBy },
  { key: 'LastModifiedBy', name: 'LastModifiedByField', value: FieldType.LastModifiedBy },
  { key: 'Cascader', name: 'CascaderField', value: FieldType.Cascader },
  { key: 'OneWayLink', name: 'OneWayLinkField', value: FieldType.OneWayLink },
  { key: 'Button', name: 'ButtonField', value: FieldType.Button },
  { key: 'WorkDoc', name: 'WorkDocField', value: FieldType.WorkDoc },
]);
