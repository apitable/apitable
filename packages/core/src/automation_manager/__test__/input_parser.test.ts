import { InputParser } from 'automation_manager/input_parser';
import { IExpressionOperand, OperandTypeEnums, OperatorEnums } from 'automation_manager/interface';
import { MagicVariableParser } from 'automation_manager/magic_variable/magic_variable_parser';
import { getNodeOutput, getObjectProperty, concatString, newArray, newObject } from 'automation_manager/magic_variable/sys_functions';
import { recordMatchConditionTriggerInput, runtimeContext, webhookSendRequestInput } from './mock_data';

describe('get value of variable', () => {
  const sysFunctions = [getNodeOutput, getObjectProperty, concatString, newArray, newObject];
  const parser = new MagicVariableParser<typeof runtimeContext>(sysFunctions);
  const inputParser = new InputParser(parser);

  it('webhook input', () => {
    const res = inputParser.render(webhookSendRequestInput as IExpressionOperand, runtimeContext);
    expect(res).toEqual({
      url: 'https://oapi.dingtalk.com/robot/send?access_token=8bfaxxbd2cbd490594a99609b44f98e637e7233fb4ff57ec97d9b866cec07c8e',
      method: 'POST',
      headers: 'Content-Type: application/json',
      body: '{\n' +
        '  "msgtype": "link",\n' +
        '  "link": {\n' +
        '      "text": "apitableA",\n' +
        '      "title": "doge: automation test",\n' +
        '      "picUrl": "",\n' +
        '      "messageUrl": "https://example.com"\n' +
        '  }\n' +
        '}\n'
    });
  });

  it('literal string can be key of expression object', () => {
    const res = inputParser.render({
      type: OperandTypeEnums.Expression,
      value: {
        operands: [
          {
            type: OperandTypeEnums.Literal,
            value: 'a'
          },
          {
            type: OperandTypeEnums.Literal,
            value: 1,
          },
          'b',
          {
            type: OperandTypeEnums.Literal,
            value: 2,
          }
        ],
        operator: OperatorEnums.NewObject,
      }
    } as IExpressionOperand, runtimeContext);
    expect(res).toEqual({
      a: 1,
      b: 2
    });
  });

  const triggerParser = new MagicVariableParser<any>([newArray, newObject]);
  const triggerInputParser = new InputParser(triggerParser);
  it('record matches condition trigger input', () => {
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
