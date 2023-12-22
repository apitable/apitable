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

import { IAttachmentValue, ILinkIds, IMultiSelectedIds, ISegment, ITimestamp, IUnitIds, IWorkDocValue } from 'types/field_types';

export type ICellValueBase =
  | null
  | number
  | string
  | boolean
  | ISegment[]
  | IMultiSelectedIds
  | ITimestamp
  | IAttachmentValue[]
  | IWorkDocValue[]
  | ILinkIds
  | IUnitIds;

// LookUp value is another entity field cell value flat array
export type ILookUpValue = ICellValueBase[];
export type ICellValue = ICellValueBase | ILookUpValue;

export type ICellToStringOption = {
  datasheetId?: string;
  hideUnit?: boolean;
  orderInCellValueSensitive?: boolean;
};

export enum CellFormatEnum {
  STRING = 'string',
  JSON = 'json',
}

export enum FieldKeyEnum {
  NAME = 'name',
  ID = 'id',
}
