import { IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isString } from 'class-validator';
import { FieldManager } from 'fusion/field.manager';
import { BaseTextField } from 'fusion/field/base.text.field';
import { IFieldValue } from 'shared/interfaces';

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
