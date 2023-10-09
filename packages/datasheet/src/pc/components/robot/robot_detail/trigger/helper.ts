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

import produce from 'immer';
import { Field, FOperator, IExpressionOperand, IField, IFieldMap, IViewColumn, OperandTypeEnums, OperatorEnums, t, Strings } from '@apitable/core';

export const getFields = (columns: IViewColumn[], fieldMap: IFieldMap) => {
  if(!columns) return [];
  return columns?.map((column) => {
    return fieldMap[column.fieldId];
  });
};

const fop2opMap = {
  [FOperator.Is]: OperatorEnums.Equal,
  [FOperator.IsNot]: OperatorEnums.NotEqual,
  [FOperator.Contains]: OperatorEnums.Includes,
  [FOperator.DoesNotContain]: OperatorEnums.NotIncludes,
  [FOperator.IsEmpty]: OperatorEnums.IsNull,
  [FOperator.IsNotEmpty]: OperatorEnums.IsNotNull,
  [FOperator.IsGreater]: OperatorEnums.GreaterThan,
  [FOperator.IsGreaterEqual]: OperatorEnums.GreaterThanOrEqual,
  [FOperator.IsLess]: OperatorEnums.LessThan,
  [FOperator.IsLessEqual]: OperatorEnums.LessThanOrEqual,
};
const fOperator2Operator = (fOperator: FOperator) => {
  return fop2opMap[fOperator] || OperatorEnums.IsNotNull;
};

export const op2fop = (op: OperatorEnums) => {
  // fop2opMap key value reverse
  const op2fopMap = Object.keys(fop2opMap).reduce(
    (acc, key) => {
      acc[fop2opMap[key]] = key as FOperator;
      return acc;
    },
    {} as { [key: string]: FOperator },
  );
  return op2fopMap[op];
};

export const getOperatorOptions = (field: IField) => {
  const fOperators: FOperator[] = Field.bindModel(field).acceptFilterOperators;
  // No support for "IsRepeat" operations
  return fOperators
    .filter((fop) => fop != FOperator.IsRepeat)
    .map((fop) => {
      return {
        value: fOperator2Operator(fop),
        label: Field.bindModel(field).showFOperatorDesc(fop),
      };
    })
    .filter(Boolean);
};

export const getBooleanOptionName = (value: string): string => {
  if (value === 'and') {
    return t(Strings.robot_trigger_match_condition_and);
  }
  if (value === 'or') {
    return t(Strings.robot_trigger_match_condition_or);
  }
  return '';
};

export enum FilterTypeEnums {
  Filter = 'filter',
  FilterGroup = 'filterGroup',
}

export const addNewFilter = (filter: { operator: OperatorEnums }, type: FilterTypeEnums, primaryFieldId?: string) => {
  const getNewFilter = () => {
    const newFilter: IExpressionOperand = {
      type: OperandTypeEnums.Expression,
      value: {
        operator: OperatorEnums.IsNotNull,
        operands: [
          { type: OperandTypeEnums.Literal, value: primaryFieldId },
          { type: OperandTypeEnums.Literal, value: '' },
        ],
      },
    };
    if (type === FilterTypeEnums.FilterGroup) {
      const newFilterExpression: IExpressionOperand = {
        type: OperandTypeEnums.Expression,
        value: {
          operator: filter?.operator || OperatorEnums.And,
          operands: [newFilter],
        },
      };
      return newFilterExpression;
    }
    return newFilter;
  };
  const newFilter = getNewFilter();
  if (filter) {
    return produce(filter, (draft) => {
      // @ts-ignore
      draft.operands.push(newFilter);
    });
  }
  // When the filter is created initially, it is always returned as a group.
  return {
    operator: OperatorEnums.And,
    operands: [newFilter],
  };
};
