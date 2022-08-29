import { EmojisConfig } from 'config/emojis_config';
import { FormulaField, LookUpField } from 'model';
import { IUserMap, ViewType } from 'store';
import {
  BasicValueType, DateFormat, FieldType,
  IAPIMetaCurrencyFormat,
  IAPIMetaDateTimeFormat,
  IAPIMetaNoneStringValueFormat, IAPIMetaNumberFormat, IAPIMetaUser, IComputedFieldFormattingProperty,
  IDateTimeFieldPropertyFormat, INumberBaseFieldPropertyFormat, IPercentFormat, MemberType, TimeFormat
} from '../types';
import { APIMetaFieldPropertyFormatEnums, APIMetaFieldType, APIMetaMemberType, APIMetaViewType } from './../types/field_api_enums';
import { getCustomConfig } from 'config';
import { IOpenComputedFormat } from 'types/open/open_field_read_types';
import { CurrencyField, DateTimeField, NumberField } from './field';
import { PercentField } from './field/percent_field';

/**
 * 数组空值处理, lookup 的 cv 现在默认包含 null 值了，会对原有的计算逻辑造成影响。
 * 在 lookup 中涉及到 cellValue 运算的需要对此进行空值的转化。
 * 在 UI 中，原来渲染的 lookup 组件的 cellValue 也需要经过这层处理，保证和原来展示一致。
 * [null]=>null
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
 * 语义空值转 null
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
      if ((cellValue as any).length === 0) {
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
 * 将 emojiPicker 中存储的 icon 名称，转化为 emoji 对应的字符串。
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

export const getApiMetaPropertyFormat = (fieldInstance: LookUpField | FormulaField): IAPIMetaNoneStringValueFormat | null => {
  // 格式化为日期
  if (BasicValueType.DateTime === fieldInstance.basicValueType) {
    if (!fieldInstance.field.property.formatting) {
      return {
        type: APIMetaFieldPropertyFormatEnums.DateTime,
        format: {
          dateFormat: DateTimeField.defaultDateFormat,
          timeFormat: DateTimeField.defaultTimeFormat,
          includeTime: false
        }
      };
    }
    const {
      dateFormat,
      timeFormat,
      includeTime
    } = (fieldInstance.field.property.formatting || {}) as IDateTimeFieldPropertyFormat;
    return {
      type: APIMetaFieldPropertyFormatEnums.DateTime,
      format: {
        dateFormat: DateFormat[dateFormat],
        timeFormat: TimeFormat[timeFormat],
        includeTime
      }
    };
  }
  // 格式化为数字
  if (BasicValueType.Number === fieldInstance.basicValueType) {
    const formatting = fieldInstance.field.property.formatting as INumberBaseFieldPropertyFormat;
    switch (formatting?.formatType) {
      case FieldType.Number:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || NumberField.defaultProperty().precision,
          }
        };
      case FieldType.Percent:
        return {
          type: APIMetaFieldPropertyFormatEnums.Percent,
          format: {
            precision: formatting?.precision || PercentField.defaultProperty().precision,
          }
        };
      case FieldType.Currency:
        return {
          type: APIMetaFieldPropertyFormatEnums.Currency,
          format: {
            precision: formatting?.precision || CurrencyField.defaultProperty().precision,
            symbol: formatting?.symbol || CurrencyField.defaultProperty().symbol,
          }
        };
      default:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || NumberField.defaultProperty().precision,
          }
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
        const { name, avatar } = userMap[uuid];
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
  return getCustomConfig().maxViewCountPerSheet || 30;
};

export const getMaxManageableSpaceCount = () => {
  return getCustomConfig().maxManageableSpaceCount || 10;
};

export const getMaxFieldCountPerSheet = () => {
  return getCustomConfig().maxFieldCountPerSheet || 200;
};

/**
 * 校验 value 是否为空，null、undefined、空数组[]
 * @param value
 */
export const isNullValue = (value: any): value is null => {
  return value == null || (Array.isArray(value) && value.length === 0);
};

/**
 * IOpenComputedFormat =》 IComputedFieldFormattingProperty
 * 将外部读取计算字段format内容转换成可执行cmd的格式（公式、神奇引用）
 * @param fieldInstance 
 * @param format 
 */
export const computedFormattingToFormat =
  (format: IOpenComputedFormat): IComputedFieldFormattingProperty => {
    let formatting: IComputedFieldFormattingProperty | undefined = undefined;
    switch (format?.type) {
      case APIMetaFieldPropertyFormatEnums.DateTime: {
        const { dateFormat, timeFormat, includeTime } = format.format as IAPIMetaDateTimeFormat;
        formatting = {
          dateFormat: DateFormat[dateFormat],
          timeFormat: TimeFormat[timeFormat],
          includeTime
        };
      } break;
      case APIMetaFieldPropertyFormatEnums.Currency: {
        const { precision, symbol } = format.format as IAPIMetaCurrencyFormat;
        formatting = {
          formatType: FieldType.Currency,
          precision,
          symbol
        };
      } break;
      case APIMetaFieldPropertyFormatEnums.Number: {
        const { precision } = format.format as IAPIMetaNumberFormat;
        formatting = {
          formatType: FieldType.Number,
          precision
        };
      } break;
      case APIMetaFieldPropertyFormatEnums.Percent: {
        const { precision } = format.format as IPercentFormat;
        formatting = {
          formatType: FieldType.Percent,
          precision
        };
      }
    }
    return formatting;
  };