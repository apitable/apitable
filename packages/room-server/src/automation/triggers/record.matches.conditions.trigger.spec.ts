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
import { OperandTypeEnums, OperatorEnums } from '@apitable/core';
import { RecordMatchesConditionsTriggerFactory } from './record.matches.conditions.trigger';

describe('conditions group by field', () => {
  it('checkbox is equal', () => {
    const factory = new RecordMatchesConditionsTriggerFactory();
    const trigger = factory.createTrigger({
      input: {
        type: OperandTypeEnums.Expression,
        value: {
          operands: [
            {
              type: OperandTypeEnums.Literal,
              value: 'datasheetId',
            },
            {
              type: OperandTypeEnums.Literal,
              value: 'dstPUzpUdEZjArRNVh',
            },
            {
              type: OperandTypeEnums.Literal,
              value: 'filter',
            },
            {
              type: OperandTypeEnums.Literal,
              value: {
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldQpECSuWEig',
                        },
                        {
                          type: 'Literal',
                          value: true,
                        },
                      ],
                      operator: 'equal',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldUrmAlMd1bD',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'equal',
                    },
                  },
                ],
                operator: 'and',
              },
            },
          ],
          operator: OperatorEnums.NewObject,
        },
      },
      extra: {
        datasheetId: 'dstPUzpUdEZjArRNVh',
        datasheetName: 'CheckboxField',
        recordId: 'recKRjSMT35Nq',
        eventFields: {
          fld7piWGJ28b6: null,
          fldQpECSuWEig: true,
          fldUrmAlMd1bD: null,
        },
        fields: {
          fldQpECSuWEig: true,
          fld7piWGJ28b6: null,
          fldUrmAlMd1bD: null,
        },
        diffFields: ['fldQpECSuWEig'],
        fieldMap: {
          fld7piWGJ28b6: {
            id: 'fld7piWGJ28b6',
            name: 'Title',
            type: 19,
            property: {
              defaultValue: '',
            },
          },
          fldQpECSuWEig: {
            id: 'fldQpECSuWEig',
            name: 'Checkbox',
            type: 11,
            property: {
              icon: 'white_check_mark',
            },
          },
          fldUrmAlMd1bD: {
            id: 'fldUrmAlMd1bD',
            name: 'Checkbox 2',
            type: 11,
            property: {
              icon: 'white_check_mark',
            },
          },
        },
      },
    });
    expect(trigger?.input).toEqual({
      datasheetId: 'dstPUzpUdEZjArRNVh',
      filter: {
        operands: [
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldQpECSuWEig',
                },
                {
                  type: 'Literal',
                  value: true,
                },
              ],
              operator: 'equal',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldUrmAlMd1bD',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'equal',
            },
          },
        ],
        operator: 'and',
      },
    });
    expect(trigger?.output.datasheetId).toEqual('dstPUzpUdEZjArRNVh');
    expect(trigger?.output.datasheetName).toEqual('CheckboxField');
    expect(trigger?.output.recordId).toEqual('recKRjSMT35Nq');
    expect(trigger?.output.fldQpECSuWEig).toEqual(true);
    expect(trigger?.output.fld7piWGJ28b6).toEqual(null);
  });

  it('text base is equal, is not equal, contain, not contain, is empty, is not empty', () => {
    const factory = new RecordMatchesConditionsTriggerFactory();
    const trigger = factory.createTrigger({
      input: {
        type: 'Expression',
        value: {
          operands: [
            'datasheetId',
            {
              type: 'Literal',
              value: 'dstk5YJtbekTbEH8z1',
            },
            'filter',
            {
              type: 'Literal',
              value: {
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fld4uTaVHtgnG',
                        },
                        {
                          type: 'Literal',
                          value: ['test'],
                        },
                      ],
                      operator: 'equal',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fld0WLfOvQvT8',
                        },
                        {
                          type: 'Literal',
                          value: ['test'],
                        },
                      ],
                      operator: 'notEqual',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldfV6gFy31SE',
                        },
                        {
                          type: 'Literal',
                          value: ['test'],
                        },
                      ],
                      operator: 'includes',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldWu9STVYdSf',
                        },
                        {
                          type: 'Literal',
                          value: ['test'],
                        },
                      ],
                      operator: 'notIncludes',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldFtna3CNdDv',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNull',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldsRWW4lD0k2',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNotNull',
                    },
                  },
                ],
                operator: 'and',
              },
            },
          ],
          operator: 'newObject',
        },
      },
      extra: {
        datasheetId: 'dstk5YJtbekTbEH8z1',
        datasheetName: 'TextBaseField',
        recordId: 'reczbRKjDwqTI',
        eventFields: {
          fld0WLfOvQvT8: 'no test',
          fld4uTaVHtgnG: 'test',
          fld7piWGJ28b6: 'test',
          fldFtna3CNdDv: null,
          fldWu9STVYdSf: 'no contain',
          fldfV6gFy31SE: 'test',
          fldsRWW4lD0k2: 'no empty',
        },
        fields: {
          fldWu9STVYdSf: [
            {
              type: 1,
              text: 'no contain',
            },
          ],
          fld0WLfOvQvT8: [
            {
              text: 'no test',
              type: 1,
            },
          ],
          fld4uTaVHtgnG: [
            {
              text: 'test',
              type: 1,
            },
          ],
          fld7piWGJ28b6: [
            {
              text: 'test',
              type: 1,
            },
          ],
          fldFtna3CNdDv: null,
          fldfV6gFy31SE: [
            {
              text: 'test',
              type: 1,
            },
          ],
          fldsRWW4lD0k2: [
            {
              text: 'no empty',
              type: 1,
            },
          ],
        },
        diffFields: ['fldWu9STVYdSf'],
        fieldMap: {
          fld0WLfOvQvT8: {
            id: 'fld0WLfOvQvT8',
            name: 'Single line text 2',
            type: 19,
            property: {},
          },
          fld4uTaVHtgnG: {
            id: 'fld4uTaVHtgnG',
            name: 'Single line text',
            type: 19,
            property: {},
          },
          fld7piWGJ28b6: {
            id: 'fld7piWGJ28b6',
            name: 'Title',
            type: 19,
            property: {
              defaultValue: '',
            },
          },
          fldFtna3CNdDv: {
            id: 'fldFtna3CNdDv',
            name: 'Single line text 5',
            type: 19,
            property: {},
          },
          fldWu9STVYdSf: {
            id: 'fldWu9STVYdSf',
            name: 'Single line text 4',
            type: 19,
            property: {},
          },
          fldfV6gFy31SE: {
            id: 'fldfV6gFy31SE',
            name: 'Single line text 3',
            type: 19,
            property: {},
          },
          fldsRWW4lD0k2: {
            id: 'fldsRWW4lD0k2',
            name: 'Single line text 6',
            type: 19,
            property: {},
          },
        },
      },
    } as any);
    expect(trigger?.input).toEqual({
      datasheetId: 'dstk5YJtbekTbEH8z1',
      filter: {
        operands: [
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fld4uTaVHtgnG',
                },
                {
                  type: 'Literal',
                  value: ['test'],
                },
              ],
              operator: 'equal',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fld0WLfOvQvT8',
                },
                {
                  type: 'Literal',
                  value: ['test'],
                },
              ],
              operator: 'notEqual',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldfV6gFy31SE',
                },
                {
                  type: 'Literal',
                  value: ['test'],
                },
              ],
              operator: 'includes',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldWu9STVYdSf',
                },
                {
                  type: 'Literal',
                  value: ['test'],
                },
              ],
              operator: 'notIncludes',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldFtna3CNdDv',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNull',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldsRWW4lD0k2',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNotNull',
            },
          },
        ],
        operator: 'and',
      },
    });
    expect(trigger?.output.datasheetId).toEqual('dstk5YJtbekTbEH8z1');
    expect(trigger?.output.datasheetName).toEqual('TextBaseField');
    expect(trigger?.output.recordId).toEqual('reczbRKjDwqTI');
    expect(trigger?.output.fld0WLfOvQvT8).toEqual('no test');
    expect(trigger?.output.fld4uTaVHtgnG).toEqual('test');
    expect(trigger?.output.fld7piWGJ28b6).toEqual('test');
    expect(trigger?.output.fldFtna3CNdDv).toEqual(null);
    expect(trigger?.output.fldWu9STVYdSf).toEqual('no contain');
    expect(trigger?.output.fldfV6gFy31SE).toEqual('test');
    expect(trigger?.output.fldsRWW4lD0k2).toEqual('no empty');
  });

  it('single select is equal, is not equal, contain, not contain, is empty, is not empty', () => {
    const factory = new RecordMatchesConditionsTriggerFactory();
    const trigger = factory.createTrigger({
      input: {
        type: 'Expression',
        value: {
          operands: [
            'datasheetId',
            {
              type: 'Literal',
              value: 'dst5EQ4gcRFePCbw1S',
            },
            'filter',
            {
              type: 'Literal',
              value: {
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fld8Ww4x5TGav',
                        },
                        {
                          type: 'Literal',
                          value: ['optItTLBaXjqI'],
                        },
                      ],
                      operator: 'equal',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldD8yu9zSnqC',
                        },
                        {
                          type: 'Literal',
                          value: ['optQMKbhuITjl'],
                        },
                      ],
                      operator: 'notEqual',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldwq27AGyP7U',
                        },
                        {
                          type: 'Literal',
                          value: ['opt74mBzeDEuK'],
                        },
                      ],
                      operator: 'includes',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldTxBltNErKH',
                        },
                        {
                          type: 'Literal',
                          value: ['optV9DmWmFDXZ'],
                        },
                      ],
                      operator: 'notIncludes',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fld5HZcGE9P6a',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNull',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldXAp9uze08G',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNotNull',
                    },
                  },
                ],
                operator: 'and',
              },
            },
          ],
          operator: 'newObject',
        },
      },
      extra: {
        datasheetId: 'dst5EQ4gcRFePCbw1S',
        datasheetName: 'SingleSelectField',
        recordId: 'recYzrEuH7qhj',
        eventFields: {
          fld5HZcGE9P6a: null,
          fld7piWGJ28b6: 'test',
          fld8Ww4x5TGav: {
            id: 'optItTLBaXjqI',
            name: 'is',
            color: {
              name: 'deepPurple_0',
              value: '#E5E1FC',
            },
          },
          fldD8yu9zSnqC: {
            id: 'optFNZTXqPFyv',
            name: 'test',
            color: {
              name: 'blue_0',
              value: '#DDF5FF',
            },
          },
          fldTxBltNErKH: {
            id: 'optnRhiNB8hT6',
            name: 'no contain',
            color: {
              name: 'indigo_0',
              value: '#DDE7FF',
            },
          },
          fldXAp9uze08G: {
            id: 'optnZ7M7gPzGl',
            name: 'no empty',
            color: {
              name: 'deepPurple_0',
              value: '#E5E1FC',
            },
          },
          fldwq27AGyP7U: {
            id: 'opt74mBzeDEuK',
            name: 'contain',
            color: {
              name: 'deepPurple_0',
              value: '#E5E1FC',
            },
          },
        },
        fields: {
          fldD8yu9zSnqC: 'optFNZTXqPFyv',
          fld5HZcGE9P6a: null,
          fld7piWGJ28b6: [
            {
              text: 'test',
              type: 1,
            },
          ],
          fld8Ww4x5TGav: 'optItTLBaXjqI',
          fldTxBltNErKH: 'optnRhiNB8hT6',
          fldXAp9uze08G: 'optnZ7M7gPzGl',
          fldwq27AGyP7U: 'opt74mBzeDEuK',
        },
        diffFields: ['fldD8yu9zSnqC'],
        fieldMap: {
          fld5HZcGE9P6a: {
            id: 'fld5HZcGE9P6a',
            name: 'Select 5',
            type: 3,
            property: {
              options: [],
            },
          },
          fld7piWGJ28b6: {
            id: 'fld7piWGJ28b6',
            name: 'Title',
            type: 19,
            property: {
              defaultValue: '',
            },
          },
          fld8Ww4x5TGav: {
            id: 'fld8Ww4x5TGav',
            name: 'Select',
            type: 3,
            property: {
              options: [
                {
                  id: 'optItTLBaXjqI',
                  name: 'is',
                  color: 0,
                },
              ],
            },
          },
          fldD8yu9zSnqC: {
            id: 'fldD8yu9zSnqC',
            name: 'Select 2',
            type: 3,
            property: {
              options: [
                {
                  id: 'optizYhckVAAY',
                  name: 'no is',
                  color: 0,
                },
                {
                  id: 'optQMKbhuITjl',
                  name: 'is',
                  color: 1,
                },
                {
                  id: 'optFNZTXqPFyv',
                  name: 'test',
                  color: 2,
                },
              ],
            },
          },
          fldTxBltNErKH: {
            id: 'fldTxBltNErKH',
            name: 'Select 4',
            type: 3,
            property: {
              options: [
                {
                  id: 'optV9DmWmFDXZ',
                  name: 'contain',
                  color: 0,
                },
                {
                  id: 'optnRhiNB8hT6',
                  name: 'no contain',
                  color: 1,
                },
              ],
            },
          },
          fldXAp9uze08G: {
            id: 'fldXAp9uze08G',
            name: 'Select 6',
            type: 3,
            property: {
              options: [
                {
                  id: 'optnZ7M7gPzGl',
                  name: 'no empty',
                  color: 0,
                },
              ],
            },
          },
          fldwq27AGyP7U: {
            id: 'fldwq27AGyP7U',
            name: 'Select 3',
            type: 3,
            property: {
              options: [
                {
                  id: 'opt74mBzeDEuK',
                  name: 'contain',
                  color: 0,
                },
              ],
            },
          },
        },
      },
    } as any);
    expect(trigger?.input).toEqual({
      datasheetId: 'dst5EQ4gcRFePCbw1S',
      filter: {
        operands: [
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fld8Ww4x5TGav',
                },
                {
                  type: 'Literal',
                  value: ['optItTLBaXjqI'],
                },
              ],
              operator: 'equal',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldD8yu9zSnqC',
                },
                {
                  type: 'Literal',
                  value: ['optQMKbhuITjl'],
                },
              ],
              operator: 'notEqual',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldwq27AGyP7U',
                },
                {
                  type: 'Literal',
                  value: ['opt74mBzeDEuK'],
                },
              ],
              operator: 'includes',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldTxBltNErKH',
                },
                {
                  type: 'Literal',
                  value: ['optV9DmWmFDXZ'],
                },
              ],
              operator: 'notIncludes',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fld5HZcGE9P6a',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNull',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldXAp9uze08G',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNotNull',
            },
          },
        ],
        operator: 'and',
      },
    });
    expect(trigger?.output.datasheetId).toEqual('dst5EQ4gcRFePCbw1S');
    expect(trigger?.output.datasheetName).toEqual('SingleSelectField');
    expect(trigger?.output.recordId).toEqual('recYzrEuH7qhj');
    expect(trigger?.output.fld5HZcGE9P6a).toEqual(null);
    expect(trigger?.output.fld8Ww4x5TGav).toEqual({
      id: 'optItTLBaXjqI',
      name: 'is',
      color: {
        name: 'deepPurple_0',
        value: '#E5E1FC',
      },
    });
    expect(trigger?.output.fldD8yu9zSnqC).toEqual({
      id: 'optFNZTXqPFyv',
      name: 'test',
      color: {
        name: 'blue_0',
        value: '#DDF5FF',
      },
    });
    expect(trigger?.output.fldTxBltNErKH).toEqual({
      id: 'optnRhiNB8hT6',
      name: 'no contain',
      color: {
        name: 'indigo_0',
        value: '#DDE7FF',
      },
    });
    expect(trigger?.output.fldXAp9uze08G).toEqual({
      id: 'optnZ7M7gPzGl',
      name: 'no empty',
      color: {
        name: 'deepPurple_0',
        value: '#E5E1FC',
      },
    });
    expect(trigger?.output.fldwq27AGyP7U).toEqual({
      id: 'opt74mBzeDEuK',
      name: 'contain',
      color: {
        name: 'deepPurple_0',
        value: '#E5E1FC',
      },
    });
  });

  it('link empty, no empty', () => {
    const factory = new RecordMatchesConditionsTriggerFactory();
    const trigger = factory.createTrigger({
      input: {
        type: 'Expression',
        value: {
          operands: [
            'datasheetId',
            {
              type: 'Literal',
              value: 'dstnbUL0rqSUX5YSZN',
            },
            'filter',
            {
              type: 'Literal',
              value: {
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fld1ICN0W2hAR',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNull',
                    },
                  },
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        {
                          type: 'Literal',
                          value: 'fldWikeY5MlYI',
                        },
                        {
                          type: 'Literal',
                          value: '',
                        },
                      ],
                      operator: 'isNotNull',
                    },
                  },
                ],
                operator: 'and',
              },
            },
          ],
          operator: 'newObject',
        },
      },
      extra: {
        datasheetId: 'dstnbUL0rqSUX5YSZN',
        datasheetName: 'LinkField',
        recordId: 'recNEZMydVLCx',
        eventFields: {
          fld1ICN0W2hAR: null,
          fld7piWGJ28b6: 'title',
          fldWikeY5MlYI: [
            {
              recordId: 'reczbRKjDwqTI',
              title: 'testtest',
            },
          ],
        },
        fields: {
          fldWikeY5MlYI: ['reczbRKjDwqTI'],
          fld1ICN0W2hAR: null,
          fld7piWGJ28b6: [
            {
              text: 'title',
              type: 1,
            },
          ],
        },
        diffFields: ['fldWikeY5MlYI'],
        fieldMap: {
          fld1ICN0W2hAR: {
            id: 'fld1ICN0W2hAR',
            name: 'Magic link',
            type: 7,
            property: {
              brotherFieldId: 'fldm8Yzz1Yc9V',
              foreignDatasheetId: 'dstk5YJtbekTbEH8z1',
            },
          },
          fld7piWGJ28b6: {
            id: 'fld7piWGJ28b6',
            name: 'Title',
            type: 19,
            property: {
              defaultValue: '',
            },
          },
          fldWikeY5MlYI: {
            id: 'fldWikeY5MlYI',
            name: 'Magic link 2',
            type: 7,
            property: {
              brotherFieldId: 'fldVSnlF3Y0xW',
              foreignDatasheetId: 'dstk5YJtbekTbEH8z1',
            },
          },
        },
      },
    } as any);
    expect(trigger?.input).toEqual({
      datasheetId: 'dstnbUL0rqSUX5YSZN',
      filter: {
        operands: [
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fld1ICN0W2hAR',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNull',
            },
          },
          {
            type: 'Expression',
            value: {
              operands: [
                {
                  type: 'Literal',
                  value: 'fldWikeY5MlYI',
                },
                {
                  type: 'Literal',
                  value: '',
                },
              ],
              operator: 'isNotNull',
            },
          },
        ],
        operator: 'and',
      },
    });
    expect(trigger?.output.datasheetId).toEqual('dstnbUL0rqSUX5YSZN');
    expect(trigger?.output.datasheetName).toEqual('LinkField');
    expect(trigger?.output.recordId).toEqual('recNEZMydVLCx');
    expect(trigger?.output.fld1ICN0W2hAR).toEqual(null);
    expect(trigger?.output.fldWikeY5MlYI).toEqual([
      {
        recordId: 'reczbRKjDwqTI',
        title: 'testtest',
      },
    ]);
  });
});
