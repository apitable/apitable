import Joi from 'joi';
import { DateFormat, SymbolAlign, TimeFormat } from 'types';

export const datasheetIdString = () => Joi.string().pattern(/^dst.+/, 'datasheetId');

export const computedFormatting = () => Joi.allow(Joi.object({
  dateFormat: Joi.valid(...enumToArray(DateFormat)),
  timeFormat: Joi.valid(...enumToArray(TimeFormat)),
  includeTime: Joi.boolean(),
}), Joi.object({
  formatType: Joi.valid(...enumToArray(SymbolAlign)),
  precision: Joi.number().integer().min(0).max(10),
  symbol: Joi.string(),
  commaStyle: Joi.string(),
}));

export const computedFormattingStr = () => Joi.allow(Joi.object({
  dateFormat: Joi.valid(...enumKeyToArray(DateFormat)),
  timeFormat: Joi.valid(...enumKeyToArray(TimeFormat)),
  includeTime: Joi.boolean(),
}), Joi.object({
  precision: Joi.number().integer().min(0).max(10),
  symbol: Joi.string(),
  commaStyle: Joi.string(),
}));

const stringIsNumber = (value: string) => isNaN(Number(value)) === false;

export function enumToArray(en: Object) {
  const keys = Object.keys(en).filter(k => !stringIsNumber(k));
  return keys.map(k => en[k]);
}

export function enumKeyToArray(en: Object) {
  return Object.keys(en);
}

export function joiErrorResult(message: string, value?: any): Joi.ValidationResult {
  return {
    error: { message },
    value
  } as any as Joi.ValidationResult;
}
