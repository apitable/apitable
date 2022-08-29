import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ICellValue, IField } from '@vikadata/core';
import { IFieldValue } from 'interfaces';
import { FieldManager } from 'modules/services/fusion/field.manager';
import { BaseField } from 'modules/services/fusion/field/base.field';

@Injectable()
export class CheckboxField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (typeof fieldValue !== 'boolean') {
      this.throwException(field, 'api_param_checkbox_field_type_error', extra);
    }
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    if (fieldValue === false) return null;
    return true;
  }

  onApplicationBootstrap() {
    FieldManager.setService(CheckboxField.name, this);
  }
}
