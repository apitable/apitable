import { ICellValue, IField } from '@apitable/core';
import { IFieldRoTransformOptions, IFieldValue, IFieldVoTransformOptions } from 'shared/interfaces';

/**
 * Field conversion interface
 */
export interface IFieldTransformInterface {
  /**
   * Convert to a standard value for writing to the database
   *
   * @param fieldValue
   * @param field       Field Propertie
   * @param options     All field attributes and spaceId
   */
  roTransform(fieldValue: IFieldValue, field: IField, options: IFieldRoTransformOptions): ICellValue | Promise<ICellValue>;

  /**
   * api return convert
   *
   * @param fieldValue
   * @param field      Field Propertie
   * @param options    All field attributes and corresponding records, global member map to avoid circular search
   */
  voTransform(fieldValue: IFieldValue, field: IField, options?: IFieldVoTransformOptions): IFieldValue | Promise<IFieldValue>;
}
