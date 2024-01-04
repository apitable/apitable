import { IUnitValue } from '../../exports/store/interfaces';
import { t, Strings } from '../../exports/i18n';
import { ButtonStyleType } from 'types';
import { CollectType, SymbolAlign, IUnitIds, FieldType, DateFormat, TimeFormat } from 'types/field_types';
import { AutomationConstant } from './button_field';
export enum OtherTypeUnitId {
  Self = 'Self', // used to identify the current user
  Alien = 'Alien', // used to identify anonymous
}

// scientific notation threshold
export const numberThresholdValue = 1e16;

export function polyfillOldData(cellValue: IUnitIds | null) {
  if (!cellValue) {
    return cellValue;
  }
  if (!Array.isArray(cellValue)) {
    return null;
  }
  return cellValue.map((item) => {
    if (typeof item === 'object') {
      // old data only returns unitId
      return (item as IUnitValue).unitId;
    }
    return item;
  });
}
// Please do not migrate this part of the code to prevent circular dependencies
export const getFieldDefaultProperty = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.Attachment:
      return null;
    case FieldType.AutoNumber:
      return {
        nextId: 0,
        viewIdx: 0,
        datasheetId: '',
      };
    case FieldType.Button:
      return {
        datasheetId: '',
        text: t(Strings.button_text_click_start),
        style: {
          type: ButtonStyleType.Background,
          color: AutomationConstant.defaultColor,
        },
        action: {},
      };
    case FieldType.Cascader:
      return {
        showAll: false, // only show last level data
        linkedDatasheetId: '', // linked datasheet ID
        linkedViewId: '', // linked datasheet view ID
        linkedFields: [], // linked datasheet fields，arrange levels in array order
        fullLinkedFields: [],
      };
    case FieldType.Checkbox:
      return {
        icon: 'white_check_mark',
      };
    case FieldType.CreatedBy:
      return {
        uuids: [],
        datasheetId: '',
        subscription: false,
      };
    case FieldType.CreatedTime:
      return {
        datasheetId: '',
        dateFormat: DateFormat['YYYY/MM/DD'],
        timeFormat: TimeFormat['hh:mm'],
        includeTime: false,
      };
    case FieldType.Currency:
      return {
        symbol: '$',
        precision: 2,
        symbolAlign: SymbolAlign.default,
      };
    case FieldType.DateTime:
      return {
        dateFormat: DateFormat['YYYY/MM/DD'],
        timeFormat: TimeFormat['hh:mm'],
        includeTime: false,
        autoFill: false,
      };
    case FieldType.Email:
      return null;
    case FieldType.Formula:
      return {
        expression: '',
        datasheetId: '',
      };
    case FieldType.LastModifiedBy:
      return {
        uuids: [],
        datasheetId: '',
        collectType: CollectType.AllFields,
        fieldIdCollection: [],
      };
    case FieldType.LastModifiedTime:
      return {
        dateFormat: DateFormat['YYYY/MM/DD'],
        timeFormat: TimeFormat['hh:mm'],
        includeTime: false,
        collectType: CollectType.AllFields,
        fieldIdCollection: [],
        datasheetId: '',
      };
    case FieldType.Link:
      return {};
    case FieldType.LookUp:
      return {
        datasheetId: '',
        relatedLinkFieldId: '',
        lookUpTargetFieldId: '',
      };
    case FieldType.Member:
      return {
        isMulti: true,
        shouldSendMsg: true,
        subscription: false,
        unitIds: [],
      };
    case FieldType.Number:
      return {
        precision: 0,
        symbolAlign: SymbolAlign.right,
      };
    case FieldType.Percent:
      return {
        precision: 0,
      };
    case FieldType.OneWayLink:
      return {};
    case FieldType.Phone:
      return null;
    case FieldType.Rating:
      return { icon: 'star', max: 5 };
    case FieldType.SingleText:
      return {};
    case FieldType.Text:
      return null;
    case FieldType.URL:
      return {
        isRecogURLFlag: false,
      };
    case FieldType.WorkDoc:
      return null;
    case FieldType.SingleSelect:
      return { options: [] };
    case FieldType.DeniedField:
      return null;
    case FieldType.NotSupport:
      return null;
  }
  return null;
};
