import {
  Field, FOperator, IExpressionOperand, IField, IFieldMap, IViewColumn, OperandTypeEnums, OperatorEnums, t, Strings, IExpression
} from '@apitable/core';
import { produce } from 'immer';

export const getFields = (columns: IViewColumn[], fieldMap: IFieldMap) => {
  return columns.map(column => {
    return fieldMap[column.fieldId];
  }) as IField[];
};

export const getOperatorOptions = (field: IField) => {
  const fOperators: FOperator[] = Field.bindModel(field).acceptFilterOperators;
  // No support for "duplicate" operations.
  return fOperators.filter(fop => fop != FOperator.IsRepeat).map(fop => {
    return {
      value: fop,
      label: Field.bindModel(field).showFOperatorDesc(fop),
    };
  }).filter(Boolean);
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
export const filterData = {
  filter: {
    type: 'Literal',
    value: {
      operands: [
        {
          type: 'Expression',
          value: {
            operands: [
              {
                type: 'Literal',
                value: 'fldPCvePQTx0g'
              },
              {
                type: 'Literal',
                value: 'optCA1Qr7mn3X'
              }
            ],
            operator: 'equal'
          }
        },
        {
          type: 'Expression',
          value: {
            operands: [
              {
                type: 'Literal',
                value: 'fldiyZVA2QhFe'
              },
              {
                type: 'Literal',
                value: 3
              }
            ],
            operator: 'greaterThan'
          }
        },
        {
          type: 'Expression',
          value: {
            operands: [
              {
                type: 'Expression',
                value: {
                  operands: [
                    {
                      type: 'Literal',
                      value: 'fldPCvePQTx0g'
                    },
                    {
                      type: 'Literal',
                      value: 'optCA1Qr7mn3X'
                    }
                  ],
                  operator: 'equal'
                }
              },
              {
                type: 'Expression',
                value: {
                  operands: [
                    {
                      type: 'Literal',
                      value: 'fldiyZVA2QhFe'
                    },
                    {
                      type: 'Literal',
                      value: 3
                    }
                  ],
                  operator: 'greaterThan'
                }
              }
            ],
            operator: 'or'
          }
        }
      ],
      operator: 'and'
    }
  },
  datasheetId: {
    type: 'Literal',
    value: 'dst7CQK5vuco6J0uCZ'
  }
};

// Parse string path "operands[1]" => 1
export const getPathIndex = (path: string) => {
  const index = path.replace(/\D/g, '');
  return index ? parseInt(index, 10) : 0;
};

export enum FilterTypeEnums {
  Filter = 'filter',
  FilterGroup = 'filterGroup',
}

export const getAddFilterOptions = (depth: number) => {
  const addFilterOptions = [
    {
      value: FilterTypeEnums.Filter,
      label: 'Add filter conditions',
      subLabel: ''
    }
  ];

  // It's only a matter of time before the group filter is limited to a maximum of 3 levels.
  if (depth < 2) {
    addFilterOptions.push({
      value: FilterTypeEnums.FilterGroup,
      label: 'Add grouping filter conditions',
      subLabel: 'Grouping filter conditions can be nested and stacked, similar to raising the priority of operations through parentheses'
    });
  }
  return addFilterOptions;
};

export const addNewFilter = (filter: IExpression, type: FilterTypeEnums, primaryField?: IField) => {
  const getNewFilter = () => {
    const acceptFilterOperators = primaryField ? Field.bindModel(primaryField).acceptFilterOperators : [];
    const newFilter: IExpressionOperand = {
      type: OperandTypeEnums.Expression,
      value: {
        operator: (acceptFilterOperators[0] || FOperator.IsNotEmpty) as any as OperatorEnums,
        operands: [
          { type: OperandTypeEnums.Literal, value: primaryField?.id },
          { type: OperandTypeEnums.Literal, value: null }
        ]
      }
    };
    if (type === FilterTypeEnums.FilterGroup) {
      const newFilterExpression: IExpressionOperand = {
        type: OperandTypeEnums.Expression,
        value: {
          operator: filter?.operator || OperatorEnums.And,
          operands: [
            newFilter
          ]
        }
      };
      return newFilterExpression;
    }
    return newFilter;
  };
  const newFilter = getNewFilter();
  if (filter) {
    return produce(filter, (draft: { operands: IExpressionOperand[]; }) => {
      draft.operands.push(newFilter);
    });
  }
  // When the filter is created initially, it is always returned as a group.
  return {
    operator: OperatorEnums.And,
    operands: [
      newFilter
    ]
  };
};