import { ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isArray } from 'class-validator';
import { BaseField } from 'fusion/field/base.field';
import { isString } from 'lodash';
import { isOptionId } from 'shared/helpers/fusion.helper';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class MultiSelectField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (isArray(fieldValue)) {
      for (const value of Object.values(fieldValue)) {
        if (!isString(value)) {
          this.throwException(field, 'api_param_multiselect_field_value_type_error', extra);
        }
      }
      return;
    }
    this.throwException(field, 'api_param_multiselect_field_type_error', extra);
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    const optionIds = [];
    for (const value of Object.values(fieldValue)) {
      field.property.options.map(option => {
        if (isOptionId(value) && value === option.id) {
          optionIds.push(option.id);
        } else if (value === option.name) {
          optionIds.push(option.id);
        }
      });
    }
    return optionIds;
  }

  onApplicationBootstrap() {
    FieldManager.setService(MultiSelectField.name, this);
  }
}
