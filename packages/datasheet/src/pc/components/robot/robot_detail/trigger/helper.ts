import { Field, FOperator, IExpressionOperand, IField, IFieldMap, IViewColumn, OperandTypeEnums, OperatorEnums, t, Strings } from '@vikadata/core';
import produce from 'immer';

export const getFields = (columns: IViewColumn[], fieldMap: IFieldMap) => {
  return columns.map(column => {
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
  const op2fopMap = Object.keys(fop2opMap).reduce((acc, key) => {
    acc[fop2opMap[key]] = key as FOperator;
    return acc;
  }, {} as { [key: string]: FOperator });
  return op2fopMap[op];
};

export const getOperatorOptions = (field: IField) => {
  const fOperators: FOperator[] = Field.bindModel(field).acceptFilterOperators;
  // 不支持「有重复」操作
  return fOperators.filter(fop => fop != FOperator.IsRepeat).map(fop => {
    return {
      value: fOperator2Operator(fop),
      label: Field.bindModel(field).showFOperatorDesc(fop),
    };
  }).filter(Boolean);
};

export const getBooleanOptionName = (value): string => {
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

// 解析 string path "operands[1]" => 1
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
      label: '添加过滤条件',
      subLabel: ''
    }
  ];

  // 事不过三，分组 filter 最多只能 3 级
  if (depth < 2) {
    addFilterOptions.push({
      value: FilterTypeEnums.FilterGroup,
      label: '添加分组过滤条件',
      subLabel: '分组过滤条件可以嵌套叠加，类似通过括号提高运算优先级'
    });
  }
  return addFilterOptions;
};

export const addNewFilter = (filter, type: FilterTypeEnums, primaryFieldId?: string) => {
  const getNewFilter = () => {
    const newFilter: IExpressionOperand = {
      type: OperandTypeEnums.Expression,
      value: {
        operator: OperatorEnums.IsNotNull,
        operands: [
          { type: OperandTypeEnums.Literal, value: primaryFieldId },
          { type: OperandTypeEnums.Literal, value: '' }
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
    return produce(filter, (draft) => {
      draft.operands.push(newFilter);
    });
  }
  // 初始化创建 filter 时，始终以 group 返回。
  return {
    operator: OperatorEnums.And,
    operands: [
      newFilter
    ]
  };
};