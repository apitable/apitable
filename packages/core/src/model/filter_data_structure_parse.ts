import { FilterConjunction, FOperator, IFilterCondition, IFilterInfo } from 'types/view_types';
import { IOpenFilterCondition, IOpenFilterConditionGroup, IOpenFilterInfo } from 'types/open';
import { getFieldTypeString } from 'model/utils';
import { Field } from 'model/field';
import { getNewId, IDPrefix } from 'utils';
import Joi from 'joi';
import { enumToArray } from 'model/field/validate_schema';
import { APIMetaFieldType } from 'types';
import { IExpression, OperandTypeEnums, IExpressionOperand, IOperand } from 'automation_manager/interface';
import { isEmpty } from 'lodash';
import { IReduxState, IFieldMap, IMeta } from 'exports/store';

const getConjunctionsByGroup = (conditionGroup: IOpenFilterConditionGroup) => {
  const conjunctions = Object.keys(conditionGroup);
  if (conjunctions.length > 1) {
    throw new Error('Only the or or or and operator is supported');
  }
  if (conjunctions.length === 0) {
    return null;
  }
  return conjunctions;
};

const parseConditionsOrGroupBase = (conditions: any, parseConditionGroup: (...props: any) => any, parseCondition: (...props: any) => any) => {
  return conditions.map((item: any) => {
    if (Object.keys(item).some(v => enumToArray(FilterConjunction).includes(v))) {
      return parseConditionGroup(item);
    }
    return parseCondition(item);
  }).filter((v: any) => !isEmpty(v));
};

/**
 * Verify that the openFilter schema conforms to the convention.
 * Only the whole schema is checked for parsing, the value of the corresponding filter is not checked, it is parsed to the value.
 * @param filterInfo 
 * @param canGroup Switch to support filter groups.
 */
export function validateOpenFilter(filterInfo: IOpenFilterInfo, canGroup: boolean = false): Joi.ValidationResult {
  const validateConditionSchema = (condition: IOpenFilterCondition) => {
    return Joi.custom((value, helper) => {
      if (Object.prototype.toString.call(value) !== '[object Object]') {
        return helper.error('Object invalid');
      }
      const { fieldKey, ...valueObj } = value;
      if (!fieldKey || typeof fieldKey !== 'string') {
        return helper.error('fieldKey does not exist');
      }
      // Detects if it is an object with a fieldType of key.
      const fieldTypeArray = enumToArray(APIMetaFieldType);
      const fieldType = Object.keys(valueObj).find(i => fieldTypeArray.includes(i));
      if (!fieldType) {
        return helper.error('No fieldType exists');
      }
      // Check if it is an object with FOperator as key.
      const opObj = valueObj[fieldType];
      const opArray = enumToArray(FOperator);
      const op = Object.keys(opObj).find(i => opArray.includes(i));
      if (!op) {
        return helper.error('No operator exists');
      }
      return value;
    }).validate(condition);
  };
  const validateConditionGroupSchema = (conditionGroup: IOpenFilterConditionGroup) => {
    return Joi.custom((value, helper) => {
      if (Object.prototype.toString.call(value) !== '[object Object]') {
        return helper.error('Object invalid');
      }
      const keys = Object.keys(value);
      if (keys.length > 1) {
        return helper.error('Only the or or and operator is supported');
      }
      const fcArray = enumToArray(FilterConjunction);
      const filterConjunction = Object.keys(value).find(i => fcArray.includes(i));
      if (!filterConjunction) {
        return value;
      }
      const conditionGroupValue = value[filterConjunction];
      if (!conditionGroupValue) {
        return value;
      }

      if (!Array.isArray(conditionGroupValue)) {
        return helper.error('Array invalid');
      }
      let errorMessage: string | undefined;
      const validateConditionGroupValueSuccess = conditionGroupValue.every(item => {
        const isGroup = Object.prototype.toString.call(value) === '[object Object]' && Object.keys(item).every(k => fcArray.includes(k));
        // Temporarily block out group.
        if (isGroup && !canGroup) {
          errorMessage = 'Not support group condition';
          return false;
        }
        const { error } = isGroup ? validateConditionGroupSchema(item) : validateConditionSchema(item);
        errorMessage = error?.message;
        return !error;
      });
      if (!validateConditionGroupValueSuccess && errorMessage) {
        return helper.error(errorMessage);
      }
      return value;
    }).validate(conditionGroup);
  };
  return validateConditionGroupSchema(filterInfo);
}

/**
 * Generate external filter structures.
 * @param meta 
 * @param viewId 
 * @param state 
 */
export function parseOpenFilter(meta: IMeta, viewId: string, state: IReduxState): IOpenFilterInfo {
  const view = meta.views.find(v => v.id === viewId);
  if (!view || !view.filterInfo) {
    return {};
  }
  const { fieldMap } = meta;
  const parseCondition = (condition: IFilterCondition) => {
    const { fieldId, fieldType, operator, value } = condition;
    const _field = fieldMap[fieldId];
    if (!_field) {
      return {};
    }
    const field = Field.bindContext(_field, state);
    // Filter out
    if (operator === FOperator.IsRepeat) {
      return {};
    }
    // Check operator, filter for non-existent operators.
    if (!field.acceptFilterOperators.includes(operator)) {
      return {};
    }
    return {
      fieldKey: fieldId,
      [getFieldTypeString(fieldType)]: {
        [operator]: field.filterValueToOpenFilterValue(value)
      }
    } as IOpenFilterCondition;
  };
  const parseConditionGroup = (conditionGroup: IFilterInfo) => {
    const { conditions, conjunction } = conditionGroup;
    return {
      [conjunction]: conditions.map(item => {
        // TODO If it's a filter group, you only need to determine whether
        // the item is a filter condition or a filter group, and if it's a filter group, 
        // recursively parseConditionGroup.
        return parseCondition(item);
      }).filter(v => Object.keys(v).length > 0)
    };
  };
  return parseConditionGroup(view.filterInfo);
}

/**
 * Convert to internal filter structure.
 * @param filterInfo 
 * @param context 
 */
export function parseInnerFilter(filterInfo: IOpenFilterInfo, context: {
  fieldMap: IFieldMap, state: IReduxState
}): IFilterInfo | null {
  const { fieldMap, state } = context;
  const exitIds: string[] = [];
  const parseCondition = (condition: IOpenFilterCondition) => {
    const { fieldKey, ...valueMap } = condition;
    const field = fieldMap[fieldKey];
    if (!field) {
      return;
    }
    const fieldBind = Field.bindContext(field, state);
    const conditionId = getNewId(IDPrefix.Condition, exitIds);
    const valueMapKey = getFieldTypeString(field.type);
    const operator = Object.keys(valueMap[valueMapKey])[0];
    exitIds.push(conditionId);
    return {
      conditionId,
      fieldId: fieldKey,
      fieldType: field.type,
      operator,
      value: fieldBind.openFilterValueToFilterValue(valueMap[valueMapKey][operator])
    } as IFilterCondition;
  };
  const parseConditionGroup = (conditionGroup: IOpenFilterConditionGroup) => {
    const conjunctions = getConjunctionsByGroup(conditionGroup);

    return conjunctions ? {
      conjunction: conjunctions[0] as FilterConjunction,
      conditions: parseConditionsOrGroupBase(conditionGroup[conjunctions[0]!], parseConditionGroup, parseCondition)
    } : null;
  };
  return parseConditionGroup(filterInfo);
}

/**
 * Converting expressions to external structures.
 * Expressions for filter components.
 * @param filterExpress 
 * @param context 
 */
export function parseOpenFilterByExpress(filterExpress: IExpressionOperand, context: {
  meta: IMeta, state: IReduxState
}) {
  const { meta, state } = context;
  
  const { fieldMap } = meta;
  const parseCondition = (condition: IExpression) => {
    const { operator, operands } = condition;
    const fieldId = operands[0]?.value;
    const value = operands[1]?.value;

    const field = fieldMap[fieldId];
    if(!field) {
      return;
    }
    const fieldModel = Field.bindContext(field, state);
    
    // Check operator, filter for non-existent operators.
    if (!fieldModel.acceptFilterOperators.includes(operator as any)) {
      return {};
    }
    return {
      fieldKey: fieldId,
      [getFieldTypeString(field.type)]: {
        [operator]: fieldModel.filterValueToOpenFilterValue(value)
      }
    } as IOpenFilterCondition;
  };
  const parseConditionGroup = (conditionGroup: IExpression): IOpenFilterInfo => {
    if (!conditionGroup) {
      return {};
    }
    const { operator, operands } = conditionGroup;
    return {
      [operator]: operands.map((item: IOperand) => {
        if (enumToArray(FilterConjunction).includes(item.value.operator)) {
          return parseConditionGroup(item.value);
        }
        return parseCondition(item.value);
      }).filter((v: any) => Object.keys(v).length > 0)
    };
  };
  return parseConditionGroup(filterExpress.value);
}

/**
 * Converting external structures to expression structures.
 * @param filterInfo 
 * @param context 
 */
export function parseFilterExpressByOpenFilter(filterInfo: IOpenFilterInfo, context: {
  fieldMap: IFieldMap, state: IReduxState
}) {
  const { fieldMap, state } = context;
  const parseCondition = (condition: IOpenFilterCondition) => {
    const { fieldKey, ...valueMap } = condition;
    const field = fieldMap[fieldKey];
    if (!field) {
      return;
    }
    const fieldBind = Field.bindContext(field, state);
    const fieldType = Object.keys(valueMap)[0];
    if (!fieldType) {
      return;
    }
    const value = valueMap[fieldType];
    return {
      type: OperandTypeEnums.Expression,
      value: {
        operator: Object.keys(value)[0],
        operands: [
          {
            type: OperandTypeEnums.Literal,
            value: field.id
          },
          {
            type: OperandTypeEnums.Literal,
            value: fieldBind.openFilterValueToFilterValue(value[Object.keys(value)])
          }
        ]
      }
    };
  };
  const parseConditionGroup = (conditionGroup: IOpenFilterConditionGroup) => {
    const conjunctions = getConjunctionsByGroup(conditionGroup);
    
    return conjunctions ? {
      type: OperandTypeEnums.Expression,
      value: {
        operator: conjunctions[0],
        operands: parseConditionsOrGroupBase(conditionGroup[conjunctions[0]!], parseConditionGroup, parseCondition)
      }
    } as IExpressionOperand : null;
  };
  
  return parseConditionGroup(filterInfo);
}
