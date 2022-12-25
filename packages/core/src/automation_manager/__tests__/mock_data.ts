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

import { IRobotTaskRuntimeContext } from 'automation_manager/interface';

export const runtimeContext: IRobotTaskRuntimeContext = {
  taskId: 'taskId',
  robot: {
    id: 'robotId',
    triggerId: 'string',
    triggerTypeId: 'triggerTypeId',
    entryActionId: 'string',
    // action map;
    actionsById: {
      actionId1: {
        id: 'actionId1',
        // action type id
        typeId: 'actionType1',
        // action input
        input: {},
        // 
        nextActionId: 'string',
      }
    },
    // actionType map;
    actionTypesById: {

    }
  },
  executedNodeIds: ['triggerId1'],
  currentNodeId: 'actionId1',
  context: {
    triggerId1: {
      typeId: 'triggerTypeId',
      output: {
        datasheet: {
          id: 'dstAid',
          name: 'apitableA'
        },
        record: {
          id: 'recordId',
          url: 'url',
          fields: {
            field1: 'field1value'
          }
        }
      }
    }
  },
  isDone: false,
  success: false,
};

export const webhookSendRequestInput = {
  type: 'Expression',
  value: {
    operator: 'newObject',
    operands: [
      {
        type: 'Literal',
        value: 'url'
      },
      {
        type: 'Literal',
        value: 'https://oapi.dingtalk.com/robot/send?access_token=8bfaxxbd2cbd490594a99609b44f98e637e7233fb4ff57ec97d9b866cec07c8e'
      },
      {
        type: 'Literal',
        value: 'method'
      },
      {
        type: 'Literal',
        value: 'POST'
      },
      {
        type: 'Literal',
        value: 'headers'
      },
      {
        type: 'Literal',
        value: 'Content-Type: application/json'
      },
      {
        type: 'Literal',
        value: 'body'
      },
      {
        type: 'Expression',
        value: {
          operator: 'concatString',
          operands: [
            {
              type: 'Literal',
              value: '{\n  "msgtype": "link",\n  "link": {\n      "text": "'
            },
            {
              type: 'Expression',
              value: {
                operator: 'getObjectProperty',
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operator: 'getNodeOutput',
                      operands: [
                        {
                          type: 'Literal',
                          value: 'triggerId1'
                        }
                      ]
                    }
                  },
                  {
                    type: 'Literal',
                    value: [
                      'datasheet',
                      'name'
                    ]
                  }
                ]
              }
            },
            {
              type: 'Literal',
              value: '",\n      "title": "doge: automation test",\n      "picUrl": "",\n      "messageUrl": "https://example.com"\n  }\n}\n'
            }
          ]
        }
      }
    ]
  }
};

// 
export const recordMatchConditionTriggerInput = {
  type: 'Expression',
  value: {
    operator: 'newObject',
    operands: [
      {
        type: 'Literal',
        value: 'datasheetId'
      },
      {
        type: 'Literal',
        value: 'dst7CQK5vuco6J0uCZ'
      },
      {
        type: 'Literal',
        value: 'filter'
      },
      {
        type: 'Literal',
        value: {
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
    ]
  }
};

export const formData = {
  type: 'Expression',
  value: {
    operands: [
      'method',
      {
        type: 'Literal',
        value: 'GET'
      },
      'url',
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
                    value: '12312'
                  }
                ],
                operator: 'concatString'
              }
            }
          ],
          operator: 'concatParagraph'
        }
      },
      'headers',
      {
        type: 'Expression',
        value: {
          operands: [
            {}
          ],
          operator: 'newArray'
        }
      }
    ],
    operator: 'newObject'
  }
};

export const conditionSchema = {
  type: 'object',
  properties: {
    method: {
      enum: [
        'POST'
      ]
    }
  }
};