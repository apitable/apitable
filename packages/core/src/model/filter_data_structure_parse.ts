import { FilterConjunction, FOperator, IFilterCondition, IFilterInfo, IFilterSingleSelect } from 'types/view_types';
import { IOpenFilterCondition, IOpenFilterConditionGroup, IOpenFilterInfo } from 'types/open';
import { getFieldTypeString } from 'model/utils';
import { Field } from 'model/field';
import { getNewId, IDPrefix } from 'utils';
import Joi from 'joi';
import { enumToArray } from 'model/field/validate_schema';
import { APIMetaFieldType, FieldType } from 'types';
import { IExpression, IExpressionOperand, IOperand, OperandTypeEnums, OperatorEnums } from 'automation_manager/interface';
import { isEmpty } from 'lodash';
import { IReduxState } from 'exports/store/interfaces';
import { IFieldMap,IMeta } from 'modules/database/store/interfaces/resource/datasheet/datasheet';

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
    const filterValueMap = valueMap[valueMapKey];
    if (filterValueMap == null) {
      return;
    }
    const operator = Object.keys(filterValueMap)[0];
    exitIds.push(conditionId);
    const fieldValue = filterValueMap[operator];
    const isSingleContains = field.type === FieldType.SingleSelect && operator === FOperator.Contains;
    let value;
    if (isSingleContains) {
      value = Array.isArray(fieldValue) ?
        fieldValue.map(item => fieldBind.openFilterValueToFilterValue(item)).flat() : fieldBind.openFilterValueToFilterValue(fieldValue);
    } else {
      value = fieldBind.openFilterValueToFilterValue(fieldValue);
    }
    return {
      conditionId,
      fieldId: fieldKey,
      fieldType: field.type,
      operator,
      value: value
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

function openFilterValueToFilterValueInterceptor(fieldModel: Field, fieldValue: IFilterSingleSelect, operator: OperatorEnums, fieldType: FieldType){
  const ensuredArrayValue = Array.isArray(fieldValue)? fieldValue: [fieldValue];
  if (fieldType === FieldType.SingleSelect && operator === OperatorEnums.Contains) {
    return ensuredArrayValue.map(item => fieldModel.openFilterValueToFilterValue(item)).flat();
  }
  return fieldModel.openFilterValueToFilterValue(fieldValue);
}

function filterValueToOpenFilterValueInterceptor(fieldModel: Field, value: IFilterSingleSelect, operator: OperatorEnums, fieldType: FieldType){
  if(value == null) {
    return fieldModel.filterValueToOpenFilterValue(value);
  }
  const arrayValue: IFilterSingleSelect = Array.isArray(value) ? value : [value];
  if (operator === OperatorEnums.Contains && fieldType == FieldType.SingleSelect) {
    return arrayValue.map((option: string) => fieldModel.filterValueToOpenFilterValue([option]))
      .filter(Boolean);
  }

  return fieldModel.filterValueToOpenFilterValue(value);
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
        [operator]: filterValueToOpenFilterValueInterceptor(fieldModel, value, operator, field.type)
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
    if (!fieldType || getFieldTypeString(field.type) !== fieldType) {
      return;
    }
    const value = valueMap[fieldType];
    const fieldValue = value[Object.keys(value)];

    const operator = Object.keys(value)[0];
    const checkedFieldValue = openFilterValueToFilterValueInterceptor(fieldBind, fieldValue, operator as OperatorEnums, field.type);

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
            value: checkedFieldValue
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
