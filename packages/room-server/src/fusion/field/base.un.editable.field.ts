import { IField } from '@apitable/core';
import { BaseField } from 'fusion/field/base.field';
import { IFieldValue } from 'shared/interfaces';

/**
 * Field base classes that do not support modification and writing
 */
export abstract class BaseUnEditableField extends BaseField {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    this.throwException(field, 'api_params_can_not_operate', extra);
  }
}
