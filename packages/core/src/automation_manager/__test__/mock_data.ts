import { IRobotTaskRuntimeContext } from 'automation_manager/interface';

export const runtimeContext: IRobotTaskRuntimeContext = {
  taskId: 'taskId',
  robot: {
    id: 'robotId',
    triggerId: 'string',
    triggerTypeId: 'triggerTypeId',
    // 入口 actionID;
    entryActionId: 'string',
    // 全部 action map;
    actionsById: {
      actionId1: {
        id: 'actionId1',
        // 动作原型ID
        typeId: 'actionType1',
        // 动作输入
        input: {},
        // 
        nextActionId: 'string',
      }
    },
    // 全部 actionType map;
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
          name: '维格表A'
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

// webhook 动态输入的数据
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
              value: '",\n      "title": "doge: automation test",\n      "picUrl": "",\n      "messageUrl": "https://vika.cn"\n  }\n}\n'
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