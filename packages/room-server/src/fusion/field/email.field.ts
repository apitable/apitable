import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@apitable/core';
import { isString } from 'class-validator';
import { IFieldValue } from '../../shared/interfaces';
import { BaseTextField } from 'fusion/field/base.text.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class EmailField extends BaseTextField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(EmailField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_email_field_type_error', extra);
    }
  }
}
