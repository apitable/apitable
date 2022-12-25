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
