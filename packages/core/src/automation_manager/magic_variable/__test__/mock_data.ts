// apitableA
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
      value: '",\n      "title": "doge: automation test",\n      "picUrl": "",\n      "messageUrl": "https://example.com"\n  }\n}\n'
    }
  ]
};

// ["apitableA","apitableB"]
export const dynamicArrayExpr = {
  operator: 'newArray',
  operands: [
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: 'apitableB'
    }
  ]
};

// { "apitableA": "apitableA", "apitableB": "apitableB" }
export const dynamicObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Literal',
      value: 'apitableA',
    },
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: 'apitableB',
    },
    {
      type: 'Literal',
      value: 'apitableB',
    }
  ]
};

// { "apitableA": { "apitableA": "apitableA", "apitableB": "apitableB" }, "apitableB": "apitableB" }
export const dynamicNestedObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Literal',
      value: 'apitableA',
    },
    {
      type: 'Expression',
      value: dynamicObjectExpr,
    },
    {
      type: 'Literal',
      value: 'apitableB',
    },
    {
      type: 'Literal',
      value: 'apitableB',
    }
  ]
};

// { "apitableA": "apitableA Value", "apitableB": "apitableB" }
export const dynamicKeyObjectExpr = {
  operator: 'newObject',
  operands: [
    {
      type: 'Expression',
      value: getNodeOutputExpr,
    },
    {
      type: 'Literal',
      value: 'apitableA Value',
    },
    {
      type: 'Literal',
      value: 'apitableB',
    },
    {
      type: 'Literal',
      value: 'apitableB',
    }
  ]
};