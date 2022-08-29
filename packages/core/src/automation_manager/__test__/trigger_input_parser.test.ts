import { InputParser } from 'automation_manager/input_parser';
import { IExpressionOperand } from 'automation_manager/interface';
import { MagicVariableParser } from 'automation_manager/magic_variable/magic_variable_parser';
import { newArray, newObject } from 'automation_manager/magic_variable/sys_functions';
import { recordMatchConditionTriggerInput } from './mock_data';

describe('测试动态参数求值', () => {
  const triggerParser = new MagicVariableParser<any>([newObject, newArray]);
  const triggerInputParser = new InputParser(triggerParser);

  it('记录符合条件 trigger input', () => {
    const res = triggerInputParser.render(recordMatchConditionTriggerInput as IExpressionOperand, {});
    expect(res).toEqual(
      {
        datasheetId: 'dst7CQK5vuco6J0uCZ',
        filter: {
          operator: 'and',
          operands: [
            // 状态 = 下单
            {
              type: 'Expression',
              value: {
                operator: '=', // 这里的 operator 虽然是 =，第一个操作数是字段ID。 但是在解析表达式时，可以重载 = ，将第一个操作数转换为具体值
                operands: [
                  {
                    type: 'Literal',
                    value: 'fldPCvePQTx0g'
                  },
                  {
                    type: 'Literal',
                    value: 'optCA1Qr7mn3X'
                  }
                ]
              }
            },
            {
              type: 'Expression',
              value: {
                // 数量 > 3
                operator: '>',
                operands: [
                  {
                    type: 'Literal',
                    value: 'fldiyZVA2QhFe'
                  },
                  {
                    type: 'Literal',
                    value: 3
                  }
                ]
              }
            }
          ]
        }
      }
    );
  });
});
