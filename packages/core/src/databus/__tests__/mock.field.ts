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

import { APIMetaFieldType, IAPIMetaField } from 'types';

export const mockFieldVos: IAPIMetaField[] = [
  {
    id: 'fld1',
    name: 'field 1',
    type: APIMetaFieldType.Text,
    property: undefined,
    isPrimary: true,
    editable: undefined as any,
  },
  {
    id: 'fld2',
    name: 'field 2',
    type: APIMetaFieldType.MultiSelect,
    property: {
      options: [
        {
          color: {
            name: 'deepPurple_0',
            value: '#E5E1FC',
          },
          id: 'opt1',
          name: 'option 1',
        },
        {
          color: {
            name: 'indigo_0',
            value: '#DDE7FF',
          },
          id: 'opt2',
          name: 'option 2',
        },
        {
          color: {
            name: 'blue_0',
            value: '#DDF5FF',
          },
          id: 'opt3',
          name: 'option 3',
        },
      ],
    },
    editable: undefined as any,
  },
];
