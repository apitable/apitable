import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IField } from '@vikadata/core';
import { IFieldValue } from 'interfaces';
import { BaseUnEditableField } from 'modules/services/fusion/field/base.un.editable.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class FormulaField extends BaseUnEditableField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(FormulaField.name, this);
  }

  validate(fieldValue: IFieldValue, field: IField) {
    this.throwException(field, 'api_params_formula_can_not_operate');
  }
}
