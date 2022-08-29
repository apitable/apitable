import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@vikadata/core';
import { isString } from 'class-validator';
import { IFieldValue } from 'interfaces';
import { BaseTextField } from 'modules/services/fusion/field/base.text.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class TextField extends BaseTextField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(TextField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_text_field_type_error', extra);
    }
  }
}
