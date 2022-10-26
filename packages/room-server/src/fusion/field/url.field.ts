import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@apitable/core';
import { isString } from 'class-validator';
import { IFieldValue } from 'interfaces';
import { FieldManager } from 'fusion/field.manager';
import { BaseTextField } from 'fusion/field/base.text.field';

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
