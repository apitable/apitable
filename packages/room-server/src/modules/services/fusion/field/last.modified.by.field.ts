import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@vikadata/core';
import { IFieldValue } from 'interfaces';
import { BaseUnEditableField } from 'modules/services/fusion/field/base.un.editable.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class LastModifiedByField extends BaseUnEditableField implements OnApplicationBootstrap {
  onApplicationBootstrap(): any {
    FieldManager.setService(LastModifiedByField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField) {
    this.throwException(field, 'api_params_updatedby_can_not_operate');
  }
}
