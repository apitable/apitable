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