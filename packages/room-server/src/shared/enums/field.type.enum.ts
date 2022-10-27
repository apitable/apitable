import { FieldType } from '@apitable/core';
import Enum from './enum';

export {
  APIMetaViewType as ViewTypeTextEnum,
  APIMetaFieldPermissionLevel as FieldPermissionEnum,
  APIMetaFieldType as FieldTypeTextEnum
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
]);