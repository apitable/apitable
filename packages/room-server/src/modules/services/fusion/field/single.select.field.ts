import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ICellValue, IField } from '@apitable/core';
import { isOptionId } from 'helpers/fusion.helper';
import { IFieldValue } from 'interfaces';
import { isString } from 'lodash';
import { BaseField } from 'modules/services/fusion/field/base.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class SingleSelectField extends BaseField implements OnApplicationBootstrap {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (!isString(fieldValue)) {
      this.throwException(field, 'api_param_select_field_value_type_error', extra);
    }
    // 不再校验选项的存在性。
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
