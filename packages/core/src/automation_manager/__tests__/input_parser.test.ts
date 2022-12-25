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
