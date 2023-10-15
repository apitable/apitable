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

export enum NotifyKey {
  ArchiveRecord = 'archiveRecord',
  Export = 'export',
  Paste = 'paste',
  DeleteRecord = 'deleteRecord',
  Undo = 'undo',
  // clear Record data
  ClearRecordData = 'clearRecordData',
  DeleteField = 'deleteField',
  DeleteOption = 'deleteOption',
  ChangeOptionName = 'changeOptionName',
  AddField = 'addField',
  ChangeFieldSetting = 'changeFieldSetting',
  InsertField = 'insetField',
  DuplicateField = 'DuplicateField',
  FillCell = 'fillCell',
  DeleteKanbanGroup = 'deleteKanbanGroup',
  Rollback = 'rollback',
}

export interface ICustomNotifyConfig {
  btnText: string;
  btnFn(): void | Promise<void>;
  key: NotifyKey;
  dom?: HTMLElement | null;
}
