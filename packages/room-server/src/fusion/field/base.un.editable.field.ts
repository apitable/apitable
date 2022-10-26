import { IField } from '@apitable/core';
import { IFieldValue } from 'interfaces';
import { BaseField } from 'fusion/field/base.field';

/**
 * <p>
 * 不支持修改和写入的字段超类
 * </p>
 * @author Zoe zheng
 * @date 2020/9/8 8:54 下午
 */
export abstract class BaseUnEditableField extends BaseField {
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    this.throwException(field, 'api_params_can_not_operate', extra);
  }
}
