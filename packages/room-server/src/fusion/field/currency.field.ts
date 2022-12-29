import { IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseNumberField } from 'fusion/field/base.number.field';
import { isNumber } from 'lodash';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class CurrencyField extends BaseNumberField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(CurrencyField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isNumber(fieldValue) || Number.isNaN(fieldValue)) {
      this.throwException(field, 'api_param_currency_field_type_error', extra);
    }
  }
}
