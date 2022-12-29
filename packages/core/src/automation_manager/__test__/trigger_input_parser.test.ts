import { InputParser } from 'automation_manager/input_parser';
import { IExpressionOperand } from 'automation_manager/interface';
import { MagicVariableParser } from 'automation_manager/magic_variable/magic_variable_parser';
import { newArray, newObject } from 'automation_manager/magic_variable/sys_functions';
import { recordMatchConditionTriggerInput } from './mock_data';

describe('get output value of node', () => {
  const triggerParser = new MagicVariableParser<any>([newObject, newArray]);
  const triggerInputParser = new InputParser(triggerParser);

  it('[trigger] record matches condition', () => {
    const res = triggerInputParser.render(recordMatchConditionTriggerInput as IExpressionOperand, {});
    expect(res).toEqual(
      {
        datasheetId: 'dst7CQK5vuco6J0uCZ',
        filter: {
          operator: 'and',
          operands: [
            {
              type: 'Expression',
              value: {
                operator: '=',
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
