/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { JSONSchema7, ValidationResult } from 'json-schema';
import { getLiteralOperandValue, getObjectOperandProperty, getOperandValueType, isLiteralOperand, isOperandNullValue } from './utils';
import { Strings, t } from '../exports/i18n';

/**
 * override the validate method of rjsf to support expression.
 */

export const validateMagicFormWithCustom = (rootSchema: JSONSchema7, formData: any,
  validate?: (formData: any, errors: any) => ValidationResult
) => {
  const data = validateMagicForm(rootSchema, formData);
  if(validate == null) {
    return data;
  }

  const resCustomValidator = validate?.(formData, data.errors);

  if(!resCustomValidator) {
    return data;
  }

  if(Array.isArray(resCustomValidator) && resCustomValidator.length === 0) {
    return data;
  }
  return {
    ...data,
    hasError: true,
  };
};

export const validateMagicForm = (rootSchema: JSONSchema7, formData: any) => {
  let validationError: any = null;
  const propertyErrors: any[] = [];
  try {
    if (rootSchema.type === 'object') {
      // console.log(Object.keys(rootSchema.properties!));
      if (typeof formData !== 'object') {
        propertyErrors.push({
          instancePath: '',
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object'
        });
      } else {
        Object.keys(rootSchema.properties!).forEach(propertyKey => {
          const propertySchema = rootSchema.properties![propertyKey] as JSONSchema7;
          const isRequired = rootSchema.required && rootSchema.required.indexOf(propertyKey) !== -1;
          const propertyValue = getObjectOperandProperty(formData, propertyKey, propertySchema);
          // console.log('validateFormData', {
          //   propertyKey, propertySchema, propertyValue, isRequired,
          //   rootSchema, formData,
          // });
          if (isRequired) {
            if (isOperandNullValue(propertyValue, propertySchema)) {
              propertyErrors.push({
                dataPath: `.${propertyKey}`,
                keyword: 'required',
                message: t(Strings.robot_config_empty_warning),
                params: { missingProperty: propertyKey },
                schemaPath: '#/required',
              });
            } else {
              if (propertySchema.enum) {
                if (isLiteralOperand(propertyValue) && !propertySchema.enum!.includes(getLiteralOperandValue(propertyValue))) {
                  propertyErrors.push({
                    dataPath: `.${propertyKey}`,
                    keyword: 'enum',
                    message: t(Strings.robot_config_empty_warning),
                    params: { enum: propertySchema.enum },
                    schemaPath: '#/enum',
                  });
                }
              }
            }
          } else {
            if (propertySchema.enum) {
              if (isLiteralOperand(propertyValue) && !propertySchema.enum!.includes(getLiteralOperandValue(propertyValue))) {
                propertyErrors.push({
                  dataPath: `.${propertyKey}`,
                  keyword: 'enum',
                  message: 'The specified option does not exist', // TODO: i18n
                  params: { enum: propertySchema.enum },
                  schemaPath: '#/enum',
                });
              }
            }
            if (isOperandNullValue(propertyValue, propertySchema)) {
              return;
            }
            // check type
            switch (propertySchema.type) {
              case 'object':
                if (getOperandValueType(propertyValue) !== 'object') {
                  propertyErrors.push(new Error(`${propertyKey} is not a object`));
                }
                break;
              case 'array':
                if (getOperandValueType(propertyValue) !== 'array') {
                  propertyErrors.push(new Error(`${propertyKey} is not a array`));
                }
                break;
              case 'string':
                if (getOperandValueType(propertyValue) !== 'string') {
                  // propertyErrors.push(new Error(`${propertyKey} is not a string`));
                }
                break;
              case 'number':
              case 'integer':
                if (getOperandValueType(propertyValue) !== 'number') {
                  propertyErrors.push(new Error(`${propertyKey} is not a number`));
                }
                break;
              case 'boolean':
                if (getOperandValueType(propertyValue) !== 'boolean') {
                  propertyErrors.push(new Error(`${propertyKey} is not a boolean`));
                }
                break;
              case 'null':
                break;
            }
            // then we can check the extra validation logic, but now we don't support it.
          }
          // if (propertySchema.type === 'object') {
          //   console.log('object', propertyKey, propertySchema);
          // }
        });
      }
    } else {
      throw new Error('rootSchema type must be object');
    }
  } catch (err) {
    // some unknown error happened in the validation process
    validationError = err;
  }

  return {
    hasError: validationError != null || propertyErrors.length > 0,
    validationError,
    errors: propertyErrors,
  };
};
