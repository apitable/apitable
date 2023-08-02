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

import { getNewId, IDPrefix } from '@apitable/core';

export class DatasheetDescriptionDto {
  type!: string;
  data!: IDaum[];
  render!: string;
}

interface IDaum {
  type: string;
  data: IData;
  object: string;
  children: IChildren[];
  _id: string;
}

interface IData {
  align: string;
}

interface IChildren {
  text: string;
}

export function genDatasheetDescriptionDto(text: string): DatasheetDescriptionDto {
  return {
    type: 'slate',
    data: [{
      type: 'paragraph',
      data: {
        align: 'alignLeft'
      },
      object: 'block',
      children: [
        {
          text
        }
      ],
      _id: getNewId(IDPrefix.Editor)
    },
    {
      type: 'paragraph',
      data: {
        align: 'alignLeft'
      },
      object: 'block',
      children: [
        {
          text: ''
        }
      ],
      _id: getNewId(IDPrefix.Editor)
    }],
    render: `<p class="ve_align_alignLeft">${text}</p><p class="ve_align_alignLeft"></p>`
  };
}
