import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@apitable/core';
import { IFieldValue } from 'interfaces';
import { isNumber } from 'lodash';
import { BaseNumberField } from 'modules/services/fusion/field/base.number.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class PercentField extends BaseNumberField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(PercentField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isNumber(fieldValue) || Number.isNaN(fieldValue)) {
      this.throwException(field, 'api_param_percent_field_type_error', extra);
    }
  }
}
