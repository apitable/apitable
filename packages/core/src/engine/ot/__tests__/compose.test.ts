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

import { composeOperations } from '../compose';
import { IOperation, OTActionName } from '../interface';

describe('compose operations', () => {
  it('compose 1 operation 1 action', () => {
    const operations: IOperation[] = [{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 1,
      }],
    }];
    const res = composeOperations(operations);
    expect(res).toEqual(operations);
  });

  it('compose 1 operation with 2 action', () => {
    const operations: IOperation[] = [{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 1,
      }, {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field2'],
        oi: 1,
      }],
    }];
    const res = composeOperations(operations);
    expect(res).toEqual(operations);
  });

  it('compose 1 operation with 3 action', () => {
    const operations: IOperation[] = [{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 1,
      }, {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'fieldMap', 'field1'],
        oi: { fieldType: 'test' },
        od: { fieldType: 'link' },
      }, {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field2'],
        oi: 1,
      }],
    }];
    const res = composeOperations(operations);
    expect(res).toEqual(operations);
  });

  it('compose 2 operations each with 1 match action', () => {
    const operations: IOperation[] = [{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 1,
      }],
    }, {
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectReplace,
        p: ['recordMap', 'data', 'field1'],
        od: 1,
        oi: 2,
      }],
    }];
    const res = composeOperations(operations);
    expect(res).toEqual([{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 2,
      }],
    }]);
  });

  it('compose 2 operations each with 1 not match action', () => {
    const operations: IOperation[] = [{
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectInsert,
        p: ['recordMap', 'data', 'field1'],
        oi: 1,
      }],
    }, {
      cmd: 'testCMD',
      actions: [{
        n: OTActionName.ObjectReplace,
        p: ['meta', 'fieldMap', 'field1'],
        oi: { fieldType: 'test' },
        od: { fieldType: 'link' },
      }],
    }];
    const res = composeOperations(operations);
    expect(res).toEqual(operations);
  });

  it('Combine multiple operations on field display and hide', () => {
    const operations: IOperation[] = [
      {
        cmd: 'ModifyViews',
        actions: [
          {
            n: OTActionName.ListReplace,
            p: [
              'meta',
              'views',
              0,
              'columns',
              2
            ],
            ld: {
              width: 145,
              hidden: false,
              fieldId: 'fld2di1GhLLBD'
            },
            li: {
              width: 145,
              hidden: true,
              fieldId: 'fld2di1GhLLBD'
            }
          }
        ],

      },
      {
        cmd: 'ModifyViews',
        actions: [
          {
            n: OTActionName.ListReplace,
            p: [
              'meta',
              'views',
              0,
              'columns',
              3
            ],
            ld: {
              hidden: false,
              fieldId: 'fldok6Y3X2uTC'
            },
            li: {
              hidden: true,
              fieldId: 'fldok6Y3X2uTC'
            }
          }
        ],

      },
    ];

    const res = composeOperations(operations);
    expect(res).toEqual(operations);
  });
});
