import { ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseField } from 'fusion/field/base.field';
import { isString } from 'lodash';
import { isOptionId } from 'shared/helpers/fusion.helper';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class SingleSelectField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_select_field_value_type_error', extra);
    }
    // No longer checks the existence of options.
    return;
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    for (const option of field.property.options) {
      if (isOptionId(fieldValue as string) && fieldValue === option.id) {
        return option.id;
      }
      if (fieldValue === option.name) {
        return option.id;
      }
    }
    return null;
  }

  onApplicationBootstrap() {
    FieldManager.setService(SingleSelectField.name, this);
  }
}
