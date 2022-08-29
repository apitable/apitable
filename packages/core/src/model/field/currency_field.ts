import Joi from 'joi';
import { IReduxState } from 'store';
import { DatasheetActions } from '../datasheet';
import { NumberBaseField } from './number_base_field';
import { ICellToStringOption, ICellValue } from 'model/record';
import { numberToShow, str2Currency, str2number } from 'utils';
import { DefaultCommaStyle, FieldType, ICurrencyField, ICurrencyFieldProperty, IField, SymbolAlign } from 'types/field_types';
import { IAPIMetaCurrencyFieldProperty } from './../../types/field_api_property_types';
import { enumToArray } from 'model/field/validate_schema';
import { TSymbolAlign } from 'types';
import { IOpenCurrencyFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenCurrencyFieldProperty } from 'types/open/open_field_write_types';

export const getSymbolAlignStr = (symbolAlign?: SymbolAlign.default | SymbolAlign.left | SymbolAlign.right): undefined | TSymbolAlign => {
  if (symbolAlign == null) {
    return undefined;
  }
  const alignMap = ['Default', 'Left', 'Right'];
  if (![1, 2].includes(symbolAlign)) {
    symbolAlign = 0;
  }
  return alignMap[symbolAlign] as TSymbolAlign;
};

export class CurrencyField extends NumberBaseField {
  constructor(public field: ICurrencyField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    symbol: Joi.string().allow('').required(),
    precision: Joi.number().integer().min(0).max(10).required(),
    defaultValue: Joi.string().allow(''),
    symbolAlign: Joi.valid(...enumToArray(SymbolAlign)),
  }).required();

  get apiMetaProperty(): IAPIMetaCurrencyFieldProperty {
    const { defaultValue, precision, symbol, symbolAlign } = this.field.property;
    return {
      defaultValue: defaultValue || undefined,
      precision,
      symbol,
      symbolAlign: getSymbolAlignStr(symbolAlign),
    };
  }

  // 预览态数据 —— 包含 (正负号) + 货币符号 + 科学计数法数字 或 普通数字 + 千位分隔
  cellValueToString(cellValue: ICellValue, cellToStringOption?: ICellToStringOption): string | null {

    if (this.validate(cellValue)) {
      const { symbol, precision, symbolAlign } = this.field.property;
      let cellString: string | null;

      cellString = numberToShow(cellValue, precision);
      const { hideUnit } = cellToStringOption || {};
      if (!hideUnit) {
        cellString = str2Currency(cellString, symbol, 3, DefaultCommaStyle, symbolAlign);
      }
      return cellString || null;
    }
    return null;
  }

  // 返回新增 record 时字段属性配置的默认值
  defaultValue(): ICellValue {
    const { defaultValue } = this.field.property;
    return defaultValue ? str2number(defaultValue) : null;
  }

  compareCellValue(cellValue: ICellValue): number | null {
    const cellValue2Str = this.cellValueToString(cellValue, { hideUnit: true });
    return cellValue2Str === null ? null : str2number(cellValue2Str as string);
  }

  compare(cellValue1: number, cellValue2: number): number {
    return NumberBaseField._compare(
      this.compareCellValue(cellValue1),
      this.compareCellValue(cellValue2),
    );
  }

  validateProperty() {
    return CurrencyField.propertySchema.validate(this.field.property);
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICurrencyField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Currency,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty() {
    return {
      symbol: '¥',
      precision: 2,
      symbolAlign: SymbolAlign.default
    };
  }

  static openUpdatePropertySchema = Joi.object({
    symbol: Joi.string().allow(''),
    precision: Joi.number().integer().min(0).max(10),
    defaultValue: Joi.string().allow(''),
    symbolAlign: Joi.valid(...enumToArray(TSymbolAlign)),
  }).required();

  get openFieldProperty(): IOpenCurrencyFieldProperty {
    const { defaultValue, symbol, precision, symbolAlign } = this.field.property;
    return {
      defaultValue,
      symbol,
      precision,
      symbolAlign: getSymbolAlignStr(symbolAlign)
    };
  }

  validateUpdateOpenProperty(updateProperty: IUpdateOpenCurrencyFieldProperty) {
    return CurrencyField.openUpdatePropertySchema.validate(updateProperty);
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenCurrencyFieldProperty): ICurrencyFieldProperty {
    const { defaultValue, symbolAlign: symbolAlignStr, symbol, precision } = openFieldProperty;
    const defaultProperty = CurrencyField.defaultProperty();
    const symbolAlign = symbolAlignStr === undefined ? defaultProperty.symbolAlign : SymbolAlign[symbolAlignStr.toLocaleLowerCase()];
    return {
      defaultValue,
      symbol: symbol || defaultProperty.symbol,
      precision: precision || defaultProperty.precision,
      symbolAlign: symbolAlign
    };
  }
}
