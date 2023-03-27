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

import { getCustomConfig } from 'config';
import { EmojisConfig } from 'config/emojis_config';
import { FormulaField, LookUpField } from 'model';
import { IOpenComputedFormat } from 'types/open/open_field_read_types';
import { IUserMap, ViewType } from '../exports/store';
import {
  BasicValueType,
  DateFormat,
  FieldType,
  IAPIMetaCurrencyFormat,
  IAPIMetaDateTimeFormat,
  IAPIMetaNoneStringValueFormat,
  IAPIMetaNumberFormat,
  IAPIMetaUser,
  IComputedFieldFormattingProperty,
  IDateTimeFieldPropertyFormat,
  INumberBaseFieldPropertyFormat,
  IPercentFormat,
  MemberType,
  TimeFormat,
} from '../types';
import { APIMetaFieldPropertyFormatEnums, APIMetaFieldType, APIMetaMemberType, APIMetaViewType } from './../types/field_api_enums';
import { CurrencyField, DateTimeField, NumberField } from './field';
import { PercentField } from './field/percent_field';

/**
 *
 * Array null value processing, lookup's cv now contains null value by default, which will affect the original calculation logic.
 * In the lookup, the cellValue operation needs to be converted to a null value.
 * In the UI, the cellValue of the original rendered lookup component also needs to be processed
 * in this layer to ensure that it is consistent with the original display.
 * [null]=>null
 *
 */
export const handleNullArray = (cv: any | null): any | null => {
  if (cv == null) {
    return null;
  }
  if (Array.isArray(cv)) {
    cv = cv.filter(v => v != null);
  }
  if (cv.length === 0) {
    return null;
  }
  return cv;
};

/**
 * Semantic null value to null
 */
export const handleEmptyCellValue = <T>(cellValue: T, basicValueType?: BasicValueType): T | null => {
  if (cellValue == null) {
    return null;
  }
  let cellValueType = basicValueType;
  if (!basicValueType) {
    if (Array.isArray(cellValue)) {
      cellValueType = BasicValueType.Array;
    }
    if (typeof cellValue === 'string') {
      cellValueType = BasicValueType.String;
    }
    if (typeof cellValue === 'boolean') {
      cellValueType = BasicValueType.Boolean;
    }
  }
  if (!cellValueType) {
    return cellValue;
  }
  switch (cellValueType) {
    case BasicValueType.Array:
      if ((cellValue as any).length === 0) {
        return null;
      }
      break;
    case BasicValueType.Boolean:
      if (!cellValue) {
        return null;
      }
      break;
    case BasicValueType.String:
      if (
        (cellValue as any).length === 0 ||
        (Array.isArray(cellValue) &&
          cellValue.length === 1 &&
          Object.prototype.toString.call(cellValue[0]) === '[object Object]' &&
          !cellValue[0]?.text)
      ) {
        return null;
      }
      break;
    default:
      return cellValue;
  }
  return cellValue;
};

/**
 * [1,2,3,6,7,11,13,14] => [[1,2,3],[6,7],[11],[13,14]
 * @param list
 */
export const groupArray = (list: number[]) => {
  const breaks: number[] = [0];
  list.forEach((currentRowIndex, index) => {
    const nextRowIndex = list[index + 1];
    if (nextRowIndex && nextRowIndex - currentRowIndex > 1) {
      breaks.push(index + 1);
    }
  });
  breaks.push(list.length);
  const res: number[][] = [];
  while (breaks.length > 1) {
    res.push(list.slice(breaks[0], breaks[1]));
    breaks.shift();
  }
  return res;
};

/**
 * Convert the icon name stored in the emojiPicker to the string corresponding to the emoji.
 */
export const getEmojiIconNativeString = (emoji: string | object): string => {
  if (!emoji) {
    return emoji;
  }
  let emojiSlug = emoji;
  if (typeof emoji === 'object') {
    emojiSlug = (emoji as any).id;
  }
  return EmojisConfig[emojiSlug as string].native;
};

const FieldTypeStringMap = {
  [FieldType.Attachment]: APIMetaFieldType.Attachment,
  [FieldType.AutoNumber]: APIMetaFieldType.AutoNumber,
  [FieldType.Checkbox]: APIMetaFieldType.Checkbox,
  [FieldType.CreatedBy]: APIMetaFieldType.CreatedBy,
  [FieldType.CreatedTime]: APIMetaFieldType.CreatedTime,
  [FieldType.Currency]: APIMetaFieldType.Currency,
  [FieldType.DateTime]: APIMetaFieldType.DateTime,
  [FieldType.Email]: APIMetaFieldType.Email,
  [FieldType.Formula]: APIMetaFieldType.Formula,
  [FieldType.LastModifiedBy]: APIMetaFieldType.LastModifiedBy,
  [FieldType.LastModifiedTime]: APIMetaFieldType.LastModifiedTime,
  [FieldType.Link]: APIMetaFieldType.MagicLink,
  [FieldType.LookUp]: APIMetaFieldType.MagicLookUp,
  [FieldType.Member]: APIMetaFieldType.Member,
  [FieldType.MultiSelect]: APIMetaFieldType.MultiSelect,
  [FieldType.NotSupport]: APIMetaFieldType.NotSupport,
  [FieldType.Number]: APIMetaFieldType.Number,
  [FieldType.Percent]: APIMetaFieldType.Percent,
  [FieldType.Phone]: APIMetaFieldType.Phone,
  [FieldType.Rating]: APIMetaFieldType.Rating,
  [FieldType.SingleSelect]: APIMetaFieldType.SingleSelect,
  [FieldType.SingleText]: APIMetaFieldType.SingleText,
  [FieldType.Text]: APIMetaFieldType.Text,
  [FieldType.URL]: APIMetaFieldType.URL,
};

export const getFieldTypeString = (fieldType: FieldType) => {
  return FieldTypeStringMap[fieldType];
};

export const getFieldTypeByString = (fieldType: APIMetaFieldType): FieldType | undefined => {
  return Number(Object.keys(FieldTypeStringMap).find(key => FieldTypeStringMap[key] === fieldType));
};

const MemberTypeStringMap = {
  [MemberType.Member]: APIMetaMemberType.Member,
  [MemberType.Team]: APIMetaMemberType.Team,
};

export const getMemberTypeString = (memberType: MemberType) => {
  return MemberTypeStringMap[memberType];
};

export const getViewTypeString = (viewType: ViewType): APIMetaViewType => {
  const ViewTypeStringMap = {
    [ViewType.Grid]: APIMetaViewType.Grid,
    [ViewType.Gallery]: APIMetaViewType.Gallery,
    [ViewType.Kanban]: APIMetaViewType.Kanban,
    [ViewType.Gantt]: APIMetaViewType.Gantt,
    [ViewType.Calendar]: APIMetaViewType.Calendar,
    [ViewType.OrgChart]: APIMetaViewType.Architecture,
  };

  return ViewTypeStringMap[viewType];
};

export const getViewTypeByString = (viewType: APIMetaViewType): ViewType => {
  const viewTypeStringMap = {
    [APIMetaViewType.Grid]: ViewType.Grid,
    [APIMetaViewType.Gallery]: ViewType.Gallery,
    [APIMetaViewType.Kanban]: ViewType.Kanban,
    [APIMetaViewType.Gantt]: ViewType.Gantt,
    [APIMetaViewType.Calendar]: ViewType.Calendar,
    [APIMetaViewType.Architecture]: ViewType.OrgChart,
  };
  return viewTypeStringMap[viewType];
};

export const getApiMetaPropertyFormat = (fieldInstance: LookUpField | FormulaField): IAPIMetaNoneStringValueFormat | null => {
  // format to datetime
  if (BasicValueType.DateTime === fieldInstance.basicValueType) {
    if (!fieldInstance.field.property.formatting) {
      return {
        type: APIMetaFieldPropertyFormatEnums.DateTime,
        format: {
          dateFormat: DateTimeField.defaultDateFormat,
          timeFormat: DateTimeField.defaultTimeFormat,
          includeTime: false,
        },
      };
    }
    const { dateFormat, timeFormat, includeTime, timeZone, includeTimeZone } = (fieldInstance.field.property.formatting ||
      {}) as IDateTimeFieldPropertyFormat;
    return {
      type: APIMetaFieldPropertyFormatEnums.DateTime,
      format: {
        dateFormat: DateFormat[dateFormat]!,
        timeFormat: TimeFormat[timeFormat]!,
        includeTime,
        timeZone,
        includeTimeZone,
      },
    };
  }
  // format to number
  if (BasicValueType.Number === fieldInstance.basicValueType) {
    const formatting = fieldInstance.field.property.formatting as INumberBaseFieldPropertyFormat;
    switch (formatting?.formatType) {
      case FieldType.Number:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || NumberField.defaultProperty().precision,
          },
        };
      case FieldType.Percent:
        return {
          type: APIMetaFieldPropertyFormatEnums.Percent,
          format: {
            precision: formatting?.precision || PercentField.defaultProperty().precision,
          },
        };
      case FieldType.Currency:
        return {
          type: APIMetaFieldPropertyFormatEnums.Currency,
          format: {
            precision: formatting?.precision || CurrencyField.defaultProperty().precision,
            symbol: formatting?.symbol || CurrencyField.defaultProperty().symbol,
          },
        };
      default:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || NumberField.defaultProperty().precision,
          },
        };
    }
  }
  return null;
};

export const getApiMetaUserProperty = (uuids: string[], userMap?: IUserMap | null) => {
  let options: IAPIMetaUser[] = [];
  if (userMap) {
    options = uuids.reduce<IAPIMetaUser[]>((pre, uuid) => {
      if (userMap[uuid]) {
        const { name, avatar } = userMap[uuid]!;
        pre.push({
          id: uuid,
          name,
          avatar: avatar || '',
        });
      }
      return pre;
    }, []);
  }
  return {
    options,
  };
};

export const getMaxViewCountPerSheet = () => {
  return getCustomConfig().MAXIMUM_VIEW_COUNT_PER_DATASHEET || 30;
};

export const getMaxManageableSpaceCount = () => {
  return getCustomConfig().MAXIMUM_MANAGEABLE_SPACE_COUNT_PER_USER || 10;
};

export const getMaxFieldCountPerSheet = () => {
  return getCustomConfig().MAXIMUM_FIELD_COUNT_PER_DATASHEET || 200;
};

/**
 * Check if value is empty, null, undefined, empty array[]
 * @param value
 */
export const isNullValue = (value: any): value is null => {
  return value == null || (Array.isArray(value) && value.length === 0);
};

/**
 * IOpenComputedFormat => IComputedFieldFormattingProperty
 * Convert the external read calculation field format content into executable cmd format (formula, magic reference)
 * @param fieldInstance
 * @param format
 */
export const computedFormattingToFormat = (format: IOpenComputedFormat): IComputedFieldFormattingProperty => {
  let formatting: IComputedFieldFormattingProperty | undefined = undefined;
  switch (format?.type) {
    case APIMetaFieldPropertyFormatEnums.DateTime:
      {
        const { dateFormat, timeFormat, includeTime } = format.format as IAPIMetaDateTimeFormat;
        formatting = {
          dateFormat: DateFormat[dateFormat],
          timeFormat: TimeFormat[timeFormat],
          includeTime,
        };
      }
      break;
    case APIMetaFieldPropertyFormatEnums.Currency:
      {
        const { precision, symbol } = format.format as IAPIMetaCurrencyFormat;
        formatting = {
          formatType: FieldType.Currency,
          precision,
          symbol,
        };
      }
      break;
    case APIMetaFieldPropertyFormatEnums.Number:
      {
        const { precision } = format.format as IAPIMetaNumberFormat;
        formatting = {
          formatType: FieldType.Number,
          precision,
        };
      }
      break;
    case APIMetaFieldPropertyFormatEnums.Percent: {
      const { precision } = format.format as IPercentFormat;
      formatting = {
        formatType: FieldType.Percent,
        precision,
      };
    }
  }
  return formatting;
};
