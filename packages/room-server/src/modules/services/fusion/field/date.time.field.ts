import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DEFAULT_TIMEZONE, ICellValue, IField } from '@apitable/core';
import { IFieldValue } from 'interfaces';
import { isNumber } from 'lodash';
import { BaseField } from 'modules/services/fusion/field/base.field';
import moment from 'moment-timezone';
import { FieldManager } from '../field.manager';

@Injectable()
export class DateTimeField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    // 时间字符串
    if (moment(fieldValue.toString()).isValid()) {
      return;
    }
    // 验证数字
    if (isNumber(fieldValue) && !Number.isNaN(fieldValue)) {
      return;
    }
    this.throwException(field, 'api_param_datetime_field_type_error', extra);
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    // 默认时区
    // todo 目前 dayjs setDefaultTimeZone 报错，之后切到dayjs
    moment.tz.setDefault(DEFAULT_TIMEZONE);
    const zoneTime = moment(fieldValue.toString());
    // 还原
    moment.tz.setDefault();
    if (zoneTime && zoneTime.isValid()) {
      // 原本时间
      if (zoneTime.hasOwnProperty('_tzm') && zoneTime.isUtcOffset()) {
        return zoneTime.valueOf() - zoneTime.utcOffset() * 60 * 1000;
      }
      return zoneTime.valueOf();
    }
    // 统一转换成毫秒
    return new Date(fieldValue as number).getTime();
  }

  onApplicationBootstrap() {
    FieldManager.setService(DateTimeField.name, this);
  }
}
