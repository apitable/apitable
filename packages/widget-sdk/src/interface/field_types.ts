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

import { APIMetaFieldType as CoreFieldType, DateFormat, TimeFormat } from 'core';

/**
 * An enum of field types
 * ``` ts
 * import { FieldType } from '@apitable/widget-sdk'
 * console.log(FieldType.Number)
 * ```
 *
 * > tips: the value obtained by `getCellValue` are supported for writing to the cell.
 */
export enum FieldType {
  /**
   * Not support type.
   */
  NotSupport = CoreFieldType.NotSupport,
  /**
   * A long text field that can span multiple lines.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  Text = CoreFieldType.Text,
  /**
   * A number.
   *
   * ** Cell read format **
   *
   * `number`
   *
   * ** Cell write format **
   *
   * `number`
   *
   * ** Field property read format **
   *
   * ```ts
   * {
   *  precision: number; // retain decimal places
   *  defaultValue?: string; // default value
   *  symbol?: string; // numerical units
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ``` ts
   * {
   *  precision: number; // retain decimal places
   *  defaultValue?: string; // default value
   *  symbol?: string; // numerical units
   * }
   * ```
   */
  Number = CoreFieldType.Number,
  /**
   * Single select allows you to select a single choice from predefined choices in a dropdown.
   *
   * ** Cell read format **
   *
   * ``` ts
   * {
   *  id: string,
   *  name: string,
   *  color: {
   *    name: string, // The unique name corresponding to the color
   *    value: string // The unique value corresponding to the color
   *  }
   * }
   * ```
   *
   * ** Cell write format **
   *
   * ``` ts
   * id: string | { id: string } | { name: string }
   * ```
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  options: {
   *    id: string;
   *    name: string;
   *    color: {
   *      name: string;
   *      value: string;
   *    };
   *  }[];
   *  defaultValue?: string; // default value（option ID）
   * }
   * ```
   *
   * ** Field property write format **
   *
   * If the option does not pass an id, it will be assumed that a new option is required
   *
   * color table [Color](/developers/widget/colors)
   *
   * If you want to allow options to be deleted,
   * you can pass an object with enableSelectOptionDelete: true as the second argument.
   * By passing this argument, any existing options which are not passed again via options will be deleted,
   * and any cells which referenced a now-deleted options will be cleared.
   *
   * ``` ts
   * {
   *  options: {
   *    id?: string;
   *    name: string;
   *    color?: string; // color name
   *  }
   *  defaultValue?: string; // default value（option ID）
   * }
   * ```
   */
  SingleSelect = CoreFieldType.SingleSelect,
  /**
   * Multiple select allows you to select one or more predefined choices from a dropdown.
   *
   * ** Cell read format **
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
   * ** Cell write format **
   *
   * ``` ts
   * id: string[] | { id: string }[] | { name: string }[]
   * ```
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  options: {
   *    id: string;
   *    name: string;
   *    color: {
   *      name: string;
   *      value: string;
   *    };
   *  }[];
   *  defaultValue?: string[];
   * }
   * ```
   *
   * ** Field property write format **
   *
   * If the option does not pass an id, it will be assumed that a new option is required
   *
   * color table [Color](/developers/widget/colors)
   *
   * If you want to allow options to be deleted,
   * you can pass an object with enableSelectOptionDelete: true as the second argument.
   * By passing this argument, any existing options which are not passed again via options will be deleted,
   * and any cells which referenced a now-deleted options will be cleared.
   *
   * ``` ts
   * {
   *  options: {
   *    id?: string;
   *    name: string;
   *    color?: string;
   *  }
   *  defaultValue?: string[];
   * }
   * ```
   */
  MultiSelect = CoreFieldType.MultiSelect,
  /**
   * A date field configured to also include a time.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string | Date`
   *
   * ** Field property read format **
   *
   * {@link DateFormat} {@link TimeFormat}
   *
   * ``` ts
   * {
   *  dateFormat: DateFormat; // data value format
   *  timeFormat?: TimeFormat; // time value format
   *  includeTime?: boolean, // whether to include time
   *  autoFill?: boolean // whether to automatically fill in the creation time when adding a record
   * }
   * ```
   *
   * ** Field property write format **
   *
   * {@link DateFormat} {@link TimeFormat}
   *
   * ``` ts
   * {
   *  dateFormat: DateFormat; // data value format
   *  timeFormat?: TimeFormat; // time value format
   *  includeTime?: boolean, // whether to include time
   *  autoFill?: boolean // whether to automatically fill in the creation time when adding a record
   * }
   * ```
   */
  DateTime = CoreFieldType.DateTime,
  /**
   * Attachments allow you to add images, documents, or other files which can then be viewed or downloaded.
   *
   * ** Cell read format **
   *
   * {@link IAttachmentValue}
   *
   * ** Cell read format **
   *
   *
   * First call the official API to upload the attachment, get the corresponding data and then write.
   *
   * The specified value will overwrite the current cell value.
   *
   * {@link IAttachmentValue}
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  Attachment = CoreFieldType.Attachment,
  /**
   * One way link, link to another record.
   *
   * ** Cell read format **
   *
   * ``` ts
   * {
   *  recordId: string,
   *  title: string
   * }[]
   * ```
   *
   * ** Cell write format **
   *
   * The currently linked record IDs and their primary cell values from the linked datasheet.
   *
   * `recordId[]`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  foreignDatasheetId: string; // The ID of the datasheet this field links to
   *  limitToView?: string; // The ID of the view in the linked datasheet to use when showing
   *  limitSingleRecord?: boolean; // Whether this field prefers to only have a single linked record
   * }
   * ```
   *
   * ** Field property write format **
   *
   * When updating the associated form ID of a magically associated field,
   * the processing of the associated field corresponding to the associated form.
   *
   * ``` ts
   * {
   *  foreignDatasheetId: string; // The ID of the datasheet this field links to
   *  limitToView?: string; // The ID of the view in the linked datasheet to use when showing
   *  limitSingleRecord?: boolean; // Whether this field prefers to only have a single linked record
   * }
   * ```
   */
  OneWayLink = CoreFieldType.OneWayLink,
  /**
   * Two way link, link to another record.
   *
   * ** Cell read format **
   *
   * ``` ts
   * {
   *  recordId: string,
   *  title: string
   * }[]
   * ```
   *
   * ** Cell write format **
   *
   * The currently linked record IDs and their primary cell values from the linked datasheet.
   *
   * `recordId[]`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  foreignDatasheetId: string; // The ID of the datasheet this field links to
   *  brotherFieldId?: string; // The ID of the field in the linked table that links back
   *  limitToView?: string; // The ID of the view in the linked datasheet to use when showing
   *  limitSingleRecord?: boolean; // Whether this field prefers to only have a single linked record
   * }
   * ```
   *
   * ** Field property write format **
   *
   * When updating the associated form ID of a magically associated field,
   * the processing of the associated field corresponding to the associated form.
   *
   * ``` ts
   * {
   *  foreignDatasheetId: string; // The ID of the datasheet this field links to
   *  limitToView?: string; // The ID of the view in the linked datasheet to use when showing
   *  limitSingleRecord?: boolean; // Whether this field prefers to only have a single linked record
   * }
   * ```
   */
  MagicLink = CoreFieldType.MagicLink,
  TwoWayLink= CoreFieldType.TwoWayLink,
  /**
   * A valid URL.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  URL = CoreFieldType.URL,
  /**
   * A valid email address.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  Email = CoreFieldType.Email,
  /**
   * A telephone number.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  Phone = CoreFieldType.Phone,
  /**
   * This field is "true" when checked and "null" when unchecked.
   *
   * ** Cell read format **
   *
   * `boolean`
   *
   * ** Cell write format **
   *
   * `boolean`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  icon: string; // Emoji slug
   * }
   * ```
   *
   * ** Field property write format **
   *
   * icon Emoji config [Emojis](/developers/widget/emojis)
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
   * A rating.
   *
   * ** Cell read format **
   *
   * `number`
   *
   * ** Cell write format **
   *
   * `number`
   *
   * ** Field property read format **
   *
   * ```ts
   * {
   *  max: number; // the maximum value for the rating, from 1 to 10 inclusive
   *  icon: string; // Emoji slug
   * }
   * ```
   *
   * ** Field property write format **
   *
   * icon Emoji config [Emojis](/developers/widget/emojis)
   *
   * ```ts
   * {
   *  max: number; // the maximum value for the rating, from 1 to 10 inclusive
   *  icon: 'star' | 'star2' | 'stars'; // icon name
   * }
   * ```
   *
   */
  Rating = CoreFieldType.Rating,
  /**
   * Select allows you to select one or more member from a dropdown.
   *
   * ** Cell read format **
   *
   * ``` ts
   * {
   *  id: string,
   *  type: 'Team' | 'Member',
   *  name: string,
   *  avatar?: string,
   * }[]
   * ```
   *
   * ** Cell write format **
   *
   * `id: string[]`
   *
   * ** Field property read format **
   *
   * ```ts
   * {
   *  isMulti: boolean; // one or more member can be selected
   *  shouldSendMsg: boolean; // whether to send message notifications after selecting members
   *  options: [
   *    id: string,
   *    type: 'Team' | 'Member',
   *    name: string,
   *    avatar?: string,
   *  ]; // Selected members
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ```ts
   * {
   *  isMulti?: boolean; // one or more member can be selected, default is true (more than one can be selected)
   *  shouldSendMsg?: boolean; // whether to send message notifications after selecting members
   * }
   * ```
   */
  Member = CoreFieldType.Member,
  /**
   * Lookup a field on linked records.
   *
   * ** Cell read format **
   *
   * `(read cell value)[]` the cellValue array of the referenced source field.
   *
   * Is at most a two-dimensional array, if the cellValue of the referenced source field is an array,
   * it is a two-dimensional array, if not, it is a one-dimensional array.
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * {@link BasicValueType}
   *
   * {@link RollUpFuncType}
   *
   * ```ts
   * {
   *  // the linked record field in this datasheet that this field is looking up
   *  relatedLinkFieldId: string;
   *  // the field in the foreign datasheet that will be looked up on each linked record
   *  targetFieldId: string;
   *  // whether the lookup field is correctly configured
   *  hasError?: boolean;
   *  // The entity field that is eventually referenced to does not contain a field of the lookup type.
   *  // In the presence of an error, the entity field may not exist.
   *  entityField?: {
   *    datasheetId: string;
   *    field: IAPIMetaField;
   *  };
   *  // aggregate functions
   *  rollupFunction?: RollUpFuncType;
   *  // return value types, including String, Boolean, Number, DateTime, Array
   *  valueType?: BasicValueType;
   *  // customizable formatting based on the type of field being referenced, such as date, number, percentage, currency field
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency',
   *    format: Format
   *  };
   * }
   * ```
   *
   * ** Field property write format **
   *
   * {@link RollUpFuncType}
   *
   * ```ts
   * {
   *  // the linked record field in this datasheet that this field is looking up
   *  relatedLinkFieldId: string;
   *  // the field in the foreign datasheet that will be looked up on each linked record
   *  targetFieldId: string;
   *  // aggregate functions
   *  rollupFunction?: RollUpFuncType;
   *  // customizable formatting based on the type of field being referenced, such as date, number, percentage, currency field
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency',
   *    format: Format
   *  };
   * }
   * ```
   */
  MagicLookUp = CoreFieldType.MagicLookUp,
  /**
   * Compute a value in each record based on other fields in the same record.
   *
   * ** Cell read format **
   *
   * `null | string | number | boolean | string[] | number[] | boolean`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * {@link BasicValueType}
   * ```ts
   * {
   *  // return value types, including String, Boolean, Number, DateTime, Array
   *  valueType: BasicValueType;
   *  // formula expressions
   *  expression: string;
   *  // false if the formula contains an error
   *  hasError: boolean;
   *  // depending on the type of field being referenced,
   *  // you can customize the format,
   *  // such as date, number, percentage, currency field, the specific format refers to the corresponding field write property
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency',
   *    format: Format
   *  };
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ```ts
   * {
   *  // formula expressions
   *  expression?: string;
   *  // depending on the type of field being referenced,
   *  // you can customize the format,
   *  // such as date, number, percentage, currency field, the specific format refers to the corresponding field write property
   *  format?: {
   *    type: 'DateTime' | 'Number' | 'Percent' | 'Currency',
   *    format: Format
   *  };
   * }
   * ```
   */
  Formula = CoreFieldType.Formula,
  /**
   * An amount of a currency.
   *
   * ** Cell read format **
   *
   * `number`
   *
   * ** Cell write format **
   *
   * `number`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  symbol?: string; // units of currency
   *  precision?: number; // from 0 to 4 inclusive
   *  defaultValue?: string;
   *  symbolAlign?: 'Default' | 'Left' | 'Right'; // arrangement of units and values
   * }
   * ```
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  symbol?: string; // units of currency
   *  precision?: number; // from 0 to 4 inclusive
   *  defaultValue?: string;
   *  symbolAlign?: 'Default' | 'Left' | 'Right'; // arrangement of units and values
   * }
   * ```
   */
  Currency = CoreFieldType.Currency,
  /**
   * A percentage.
   *
   * ** Cell read format **
   *
   * `number`
   *
   * ** Cell write format **
   *
   * `number`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  precision: number; // from 0 to 4 inclusive
   *  defaultValue?: string;
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ``` ts
   * {
   *  precision: number; // from 0 to 4 inclusive
   *  defaultValue?: string;
   * }
   * ```
   */
  Percent = CoreFieldType.Percent,
  /**
   * A single line of text.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  defaultValue?: string
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ``` ts
   * {
   *  defaultValue?: string
   * }
   * ```
   */
  SingleText = CoreFieldType.SingleText,
  /**
   * Automatically incremented unique counter for each record.
   *
   * ** Cell read format **
   *
   * `number`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  AutoNumber = CoreFieldType.AutoNumber,
  /**
   * The time the record was created in UTC.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * {@link DateFormat}
   *
   * {@link TimeFormat}
   *
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime?: boolean;
   * }
   * ```
   *
   * ** Field property write format **
   *
   * {@link DateFormat}
   *
   * {@link TimeFormat}
   *
   * ``` ts
   * {
   *  dateFormat: DateFormat;
   *  timeFormat?: TimeFormat;
   *  includeTime?: boolean;
   * ```
   *
   */
  CreatedTime = CoreFieldType.CreatedTime,
  /**
   * Shows the date and time that a record was most recently modified in any editable field or just in specific editable fields.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
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
   *  includeTime: boolean;
   *  // the fields to check the last modified time of: 0 all editable, 1 specified field
   *  collectType: CollectType;
   *  // whether to specify the field, array type can specify more than one field, not fill for all
   *  fieldIdCollection: string[];
   * }
   * ```
   *
   * ** Field property write format **
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
   *  includeTime?: boolean;
   *  // the fields to check the last modified time of: 0 all editable, 1 specified field
   *  collectType?: CollectType;
   *  // whether to specify the field, array type can specify more than one field, not fill for all
   *  fieldIdCollection?: string[];
   * }
   * ```
   *
   */
  LastModifiedTime = CoreFieldType.LastModifiedTime,
  /**
   * The collaborator who created a record.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  CreatedBy = CoreFieldType.CreatedBy,
  /**
   * Shows the last collaborator who most recently modified any editable field or just in specific editable fields.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * n/a
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  // the fields to check the last modified collaborator of: 0 all editable, 1 specified field
   *  collectType?: CollectType;
   *  // whether to specify the field, array type can specify more than one field, not fill for all
   *  fieldIdCollection?: string[];
   * }
   * ```
   *
   * ** Field property write format **
   *
   * ``` ts
   * {
   *  // the fields to check the last modified collaborator of: 0 all editable, 1 specified field
   *  collectType?: CollectType;
   *  // whether to specify the field, array type can specify more than one field, not fill for all
   *  fieldIdCollection?: string[];
   * }
   * ```

   *
   */
  LastModifiedBy = CoreFieldType.LastModifiedBy,
  /**
   * Cascader, select from a set of associated data collections
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * ``` ts
   * {
   *  showAll: boolean;
   *  linkedDatasheetId: string;
   *  linkedViewId: string;
   *  linkedFields: {
   *    id: string;
   *    name: string;
   *    type: number;
   *  }[],
   *  fullLinkedFields: {
   *    id: string;
   *    name: string;
   *    type: number;
   *  }[];
   * }
   * ```
   *
   * ** Field property write format **
   *
   *
   * ``` ts
   * {
   *  showAll: boolean;
   *  linkedDatasheetId: string;
   *  linkedViewId: string;
   *  linkedFields: {
   *    id: string;
   *    name: string;
   *    type: number;
   *  }[],
   *  fullLinkedFields: {
   *    id: string;
   *    name: string;
   *    type: number;
   *  }[];
   * }
   * ```
   */
  Cascader = CoreFieldType.Cascader,
  /**
   * A rich text editor.
   *
   * ** Cell read format **
   *
   * `string`
   *
   * ** Cell write format **
   *
   * `string`
   *
   * ** Field property read format **
   *
   * n/a
   *
   * ** Field property write format **
   *
   * n/a
   *
   */
  WorkDoc = CoreFieldType.WorkDoc,
    /**
     * Button click trigger automation.
     *
     * ** Cell read format **
     *
     * n/a
     *
     * ** Cell write format **
     *
     * n/a
     *
     * ** Field property read format **
     *
     * n/a
     *
     * ** Field property write format **
     *
     * n/a
     *
     */
  Button = CoreFieldType.Button
}

export interface IAttachmentValue {
  /** id is used as a follow key, currently the same as attachmentToken */
  id: string;
  /** filename */
  name: string;
  /** the mime type of the file */
  mimeType: string;
  /** the file is uploaded to the back-end token and the final address is accessed through the front-end assembly. */
  token: string;
  /** storage bucket location, back-end return */
  bucket: string;
  /** file size, the backend returns byte */
  size: number;
  width?: number;
  height?: number;
  /** preview address (pdf type file), without domain name */
  preview?: string;
  /** full address of the file */
  url: string;
  /** full address for previews */
  previewUrl?: string;
}

export interface IDateTimeFieldPropertyFormat {
  /** date Format */
  dateFormat: DateFormat;
  /** time Format */
  timeFormat: TimeFormat;
  /** whether to include time */
  includeTime: boolean;
}

/**
 * When the return value of a calculated field is number, the field is formatted with the number type.
 */
export interface INumberBaseFieldPropertyFormat {
  /**
   * formatting types for numbers
   */
  formatType: 'currency' | 'number' | 'datetime' | 'percent';
  /** from 0 to 4 inclusive */
  precision: number;
  /** digital Units */
  symbol?: string;
}

/**
 * Enumerated values of fieldType.
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
  Cascader = 25,
  OneWayLink = 26,
  WorkDoc = 27,
  Button = 28,
  DeniedField = 999, // no permission column
}
