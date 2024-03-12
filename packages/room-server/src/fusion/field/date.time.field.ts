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

import { ApiTipConstant, DEFAULT_TIME_ZONE, ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseField } from 'fusion/field/base.field';
import { isNumber } from 'lodash';
import moment from 'moment-timezone';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class DateTimeField extends BaseField implements OnApplicationBootstrap {
  override validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    // Time String
    if (moment(fieldValue.toString()).isValid()) {
      return;
    }
    // Verify the number
    if (isNumber(fieldValue) && !Number.isNaN(fieldValue)) {
      return;
    }
    this.throwException(field, ApiTipConstant.api_param_datetime_field_type_error, extra);
  }

  // eslint-disable-next-line require-await
  override async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    const dateTime = moment.tz(fieldValue!.toString(), DEFAULT_TIME_ZONE);
    let zoneTime = dateTime.clone();
    if (field.property.timeZone) {
      zoneTime = dateTime.clone().tz(field.property.timeZone);
    }

    if (zoneTime && zoneTime.isValid()) {
      // Original time
      if (zoneTime.hasOwnProperty('_tzm') && zoneTime.isUtcOffset()) {
        return zoneTime.valueOf() - zoneTime.utcOffset() * 60 * 1000;
      }
      return zoneTime.valueOf();
    }
    // Uniform conversion to milliseconds
    return new Date(fieldValue as number).getTime();
  }

  onApplicationBootstrap() {
    FieldManager.setService(DateTimeField.name, this);
  }
}
