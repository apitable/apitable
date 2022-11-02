import { IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseNumberField } from 'fusion/field/base.number.field';
import { isNumber } from 'lodash';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class RatingField extends BaseNumberField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isNumber(fieldValue) || Number.isNaN(fieldValue)) {
      this.throwException(field, 'api_param_rating_field_type_error', extra);
    }
    // Determine if the maximum value is exceeded
    if (fieldValue > field.property.max) {
      this.throwException(field, 'api_params_rating_field_max_error');
    }
    if (fieldValue < 0) {
      this.throwException(field, 'api_param_invalid_rating_field');
    }
  }

  onApplicationBootstrap() {
    FieldManager.setService(RatingField.name, this);
  }
}
