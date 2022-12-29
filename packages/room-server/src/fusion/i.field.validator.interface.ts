import { IField } from '@apitable/core';
import { ApiTipId } from 'shared/exception';
import { IFieldValue } from 'shared/interfaces';

/**
 * Field validation interface
 */
export interface IFieldValidatorInterface {

  /**
   * Return `string` for failed validation, return `null` for passed validation
   *
   * @param fieldValue
   * @param field       Field Propertie
   * @param extra       Prompt for additional field
   */
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string });

  throwException(field: IField, tipId: ApiTipId, value?: any, property?: string);
}
