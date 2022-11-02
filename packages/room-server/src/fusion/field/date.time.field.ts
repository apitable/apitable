import { DEFAULT_TIMEZONE, ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseField } from 'fusion/field/base.field';
import { isNumber } from 'lodash';
import moment from 'moment-timezone';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class DateTimeField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    // Time String
    if (moment(fieldValue.toString()).isValid()) {
      return;
    }
    // Verify the number
    if (isNumber(fieldValue) && !Number.isNaN(fieldValue)) {
      return;
    }
    this.throwException(field, 'api_param_datetime_field_type_error', extra);
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    // Default Time Zone
    // TODO: Currently dayjs setDefaultTimeZone is reporting an error, then cut to dayjs
    moment.tz.setDefault(DEFAULT_TIMEZONE);
    const zoneTime = moment(fieldValue.toString());
    // Revert
    moment.tz.setDefault();
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
