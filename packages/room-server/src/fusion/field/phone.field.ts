import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@apitable/core';
import { isString } from 'class-validator';
import { IFieldValue } from 'interfaces';
import { BaseTextField } from 'fusion/field/base.text.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class PhoneField extends BaseTextField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(PhoneField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_phone_field_type_error', extra);
    }
  }
}
