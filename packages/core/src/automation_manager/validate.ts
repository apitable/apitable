/**
 * 表达式 + form 的校验逻辑
 */
import { JSONSchema7 } from 'json-schema';
import { getLiteralOperandValue, getObjectOperandProperty, getOperandValueType, isLiteralOperand, isOperandNullValue } from './utils';
import { Strings, t } from 'i18n'; 

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
          // 先判断是否必填
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
              // 存在 enum 枚举值时，值是否匹配。
              if (propertySchema.enum) {
                // 判断非空值是否存在指定选项中。
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
            // 存在 enum 枚举值时，值是否匹配。
            if (propertySchema.enum) {
              // 判断非空值是否存在指定选项中。
              if (isLiteralOperand(propertyValue) && !propertySchema.enum!.includes(getLiteralOperandValue(propertyValue))) {
                propertyErrors.push({
                  dataPath: `.${propertyKey}`,
                  keyword: 'enum',
                  message: '不存在指定的选项',
                  params: { enum: propertySchema.enum },
                  schemaPath: '#/enum',
                });
              }
            }
            if (isOperandNullValue(propertyValue, propertySchema)) {
              return;
            }
            // 再判断类型是否匹配
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
            // 然后才是判断额外的校验逻辑
            // TODO: 目前不支持
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
    // 校验过程中发生了未知错误
    validationError = err;
  }

  return {
    hasError: validationError != null || propertyErrors.length > 0,
    validationError,
    errors: propertyErrors,
  };
};