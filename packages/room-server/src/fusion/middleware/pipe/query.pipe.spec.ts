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

import { ApiTipConstant, FieldType, IMeta, ViewType } from '@apitable/core';
import { ApiException } from 'shared/exception';
import { QueryPipe } from 'fusion/middleware/pipe/query.pipe';
import { OrderEnum } from 'shared/enums';

describe('QueryPipe', () => {

  describe('validateSort', () => {
    test('sort.field error--zh-CN', () => {
      const error = ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists, { fieldId: 'aa' });
      expect(() => {
        QueryPipe.validateSort([{ order: OrderEnum.DESC, field: 'aa' }], {
          Number: {
            id: 'aa',
            name: 'number',
            type: FieldType.Number,
            property: { precision: 0, defaultValue: undefined },
          },
        });
      }).toThrow(error);
    });
  });

  describe('validateViewId', () => {
    test('viewId not exists error--zh-CN', () => {
      const error = ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists);
      const meta: IMeta = {
        fieldMap: {
          fldg3EBXhzE8K: {
            id: 'fldg3EBXhzE8K',
            name: 'Status',
            type: 3,
            property: {
              options: [
                {
                  id: 'optOR6LHdzUBK',
                  name: 'Recorded',
                  color: 37,
                },
                {
                  id: 'optSgtz1OJbZt',
                  name: '[Ding]Noticed the developer to fix it',
                  color: 37,
                },
                {
                  id: 'optu8X6R40HSx',
                  name: 'fixing',
                  color: 25,
                },
                {
                  id: 'opt6BeeiJSwtz',
                  name: 'fixed',
                  color: 3,
                },
                {
                  id: 'optvyQBhNkSnG',
                  name: '[Ding]Noticed the pm for acceptance',
                  color: 4,
                },
                {
                  id: 'opt1vtk8Fj7Uv',
                  name: 'acceptance success',
                  color: 44,
                },
                {
                  id: 'optCGYmfqVJAl',
                  name: 'acceptance failed',
                  color: 27,
                },
                {
                  id: 'optKP3PtCM0Er',
                  name: 'no need to repair',
                  color: 5,
                },
                {
                  id: 'optM5X0bE5g1R',
                  name: 'can not recurrent it',
                  color: 6,
                },
                {
                  id: 'optu8lGuBMgrq',
                  name: 'closed',
                  color: 7,
                },
                {
                  id: 'opt4COW4DaMYg',
                  name: 'confirmed',
                  color: 8,
                },
                {
                  id: 'optayaCVVRPpa',
                  name: 'stopped',
                  color: 2,
                },
              ],
            },
          },
        },
        views: [{ id: 'bbbb', type: ViewType.Grid, columns: [], name: 'aaa', frozenColumnCount: 0, rows: [] }],
        widgetPanels: [{ id: 'wplAcHJtZO9f8', name: 'widget pannel', widgets: [{ id: 'wdtiJjVmNFcFmNtQFA', height: 224, y: 0 }] }],
      };
      expect(() => {
        QueryPipe.validateViewId('aa', meta);
      }).toThrow(error);
    });
  });

});
