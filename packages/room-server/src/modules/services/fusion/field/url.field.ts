import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@vikadata/core';
import { isString } from 'class-validator';
import { IFieldValue } from 'interfaces';
import { FieldManager } from 'modules/services/fusion/field.manager';
import { BaseTextField } from 'modules/services/fusion/field/base.text.field';

@Injectable()
export class UrlField extends BaseTextField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(UrlField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_url_field_type_error', extra);
    }
  }
}
