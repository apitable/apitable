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
