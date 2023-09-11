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

import { ICell, ICellValue, IField, IRecordAlarmClient, WithOptional } from '@apitable/core';

export interface IEditor {
  focus(preventScroll?: boolean): void;
  blur?: () => void;

  onEndEdit(cancel: boolean): void;

  onStartEdit(cellValue?: ICellValue): void;

  setValue(cellValue?: ICellValue): void;

  saveValue(): void;
}

export interface IBaseEditorProps {
  datasheetId: string;
  width: number;
  height: number;
  field: IField;
  disabled?: boolean;
  onSave?: (val: any, alarm?: WithOptional<IRecordAlarmClient, 'id'>) => void;
  onChange?: (val: any) => void;
}

export interface IContainerEdit {
  onViewMouseDown(activeCell?: ICell): void;
  focus(): void;
}
