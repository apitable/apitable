// 维格表A
export const getNodeOutputExpr = {
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
      },
    },
    {
      type: 'Literal',
      value: ['datasheet', 'name']
    }
  ]
};

export const dynamicStrExpr = {
  operator: 'concatString',
  operands: [
    {
      type: 'Literal',
      value: '{\n  "msgtype": "link",\n  "link": {\n      "text": "',
    },
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: '",\n      "title": "doge: automation test",\n      "picUrl": "",\n      "messageUrl": "https://vika.cn"\n  }\n}\n'
    }
  ]
};

// 动态数组表达式 ["维格表A","维格表B"]
export const dynamicArrayExpr = {
  operator: 'newArray',
  operands: [
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: '维格表B'
    }
  ]
};

// 动态对象表达式 { "维格表A": "维格表A", "维格表B": "维格表B" }
export const dynamicObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Literal',
      value: '维格表A',
    },
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: '维格表B',
    },
    {
      type: 'Literal',
      value: '维格表B',
    }
  ]
};

// 动态嵌套对象表达式 { "维格表A": { "维格表A": "维格表A", "维格表B": "维格表B" }, "维格表B": "维格表B" }
export const dynamicNestedObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Literal',
      value: '维格表A',
    },
    {
      type: 'Expression',
      value: dynamicObjectExpr,
    },
    {
      type: 'Literal',
      value: '维格表B',
    },
    {
      type: 'Literal',
      value: '维格表B',
    }
  ]
};

// 动态 key 对象表达式 { "维格表A": "维格表A Value", "维格表B": "维格表B" }
export const dynamicKeyObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: '维格表A Value',
    },
    {
      type: 'Literal',
      value: '维格表B',
    },
    {
      type: 'Literal',
      value: '维格表B',
    }
  ]
};