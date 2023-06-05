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

import { CellFormatEnum, Field, ICellValue, IField } from '@apitable/core';
import { IFieldValidatorInterface } from 'fusion/i.field.validator.interface';
import { ApiException, ApiTipId } from 'shared/exception';
import { IFieldRoTransformOptions, IFieldValue, IFieldVoTransformOptions } from 'shared/interfaces';
import { IFieldTransformInterface } from '../i.field.transform.interface';

export abstract class BaseField implements IFieldTransformInterface, IFieldValidatorInterface {
  validate(fieldValue: IFieldValue, _field: IField, _extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, _field: IField, _options?: IFieldRoTransformOptions): Promise<ICellValue> {
    return fieldValue as ICellValue;
  }

  voTransform(cellValue: ICellValue, field: IField, { cellFormat, store }: IFieldVoTransformOptions): IFieldValue {
    if (cellFormat === CellFormatEnum.STRING) {
      return Field.bindContext(field, store!.getState()).cellValueToApiStringValue(cellValue);
    }
    return Field.bindContext(field, store!.getState()).cellValueToApiStandardValue(cellValue);
  }

  throwException(_field: IField, tipId: ApiTipId, extra?: { [key: string]: string }): never {
    throw ApiException.tipError(tipId, extra);
  }

  getSetFieldAttrChangesets(_datasheetId: string, _field: IField, _store: any, _extras?: { deleteBrotherField?: boolean }) {
    return null;
  }
}
