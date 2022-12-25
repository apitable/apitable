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

import { ApiTipConstant, ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseField } from 'fusion/field/base.field';
import { isString } from 'lodash';
import { isOptionId } from 'shared/helpers/fusion.helper';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class SingleSelectField extends BaseField implements OnApplicationBootstrap {
  override validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, ApiTipConstant.api_param_select_field_value_type_error, extra);
    }
    // No longer checks the existence of options.
    return;
  }

  // eslint-disable-next-line require-await
  override async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    for (const option of field.property.options) {
      if (isOptionId(fieldValue as string) && fieldValue === option.id) {
        return option.id;
      }
      if (fieldValue === option.name) {
        return option.id;
      }
    }
    return null;
  }

  onApplicationBootstrap() {
    FieldManager.setService(SingleSelectField.name, this);
  }
}
