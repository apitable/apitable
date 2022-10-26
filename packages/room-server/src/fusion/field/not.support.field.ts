import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@apitable/core';
import { IFieldValue } from 'interfaces';
import { BaseField } from 'fusion/field/base.field';
import { FieldManager } from '../field.manager';
import { IFieldValidatorInterface } from '../i.field.validator.interface';

@Injectable()
export class NotSupportField extends BaseField implements OnApplicationBootstrap, IFieldValidatorInterface {
  validate(fieldValue: IFieldValue, field: IField) {
    this.throwException(field, 'api_param_default_error');
  }

  onApplicationBootstrap() {
    FieldManager.setService(NotSupportField.name, this);
  }
}
