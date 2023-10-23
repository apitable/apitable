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

import { Strings, t, CollaCommandName } from '@apitable/core';

export const CollaCommandTran = {
  [CollaCommandName.SetRecords]: t(Strings.command_set_record),
  [CollaCommandName.AddRecords]: t(Strings.command_add_record),
  [CollaCommandName.SetFieldAttr]: t(Strings.command_set_field_attr),
  [CollaCommandName.DeleteField]: t(Strings.command_delete_field),
  [CollaCommandName.PasteSetRecords]: t(Strings.command_paste_set_record),
  [CollaCommandName.Rollback]: t(Strings.command_rollback),
  [CollaCommandName.InsertComment]: t(Strings.command_insert_comment),
  [CollaCommandName.AddFields]: t(Strings.command_set_record),
  [CollaCommandName.FillDataToCells]: t(Strings.command_paste_set_record),
  [CollaCommandName.MoveRow]: t(Strings.command_move_row),
  [CollaCommandName.DeleteRecords]: t(Strings.command_delete_record),
  [CollaCommandName.FixConsistency]: t(Strings.command_fix_consistency),
  [CollaCommandName.ArchiveRecords]: t(Strings.archive_record_in_activity),
  [CollaCommandName.UnarchiveRecords]: t(Strings.unarchive_record_in_activity),
  'UNDO:SetRecords': t(Strings.command_undo_set_record),
  'UNDO:AddRecords': t(Strings.command_undo_add_record),
  'UNDO:SetFieldAttr': t(Strings.command_undo_set_field_attr),
  'UNDO:DeleteField': t(Strings.command_undo_delete_field),
  'UNDO:DeleteRecords': t(Strings.command_undo_delete_records),
  'UNDO:PasteSetRecords': t(Strings.command_undo_paste_set_record),
  'UNDO:Rollback': t(Strings.command_undo_rollback),
  'UNDO:AddFields': t(Strings.command_undo_set_record),
  'UNDO:FillDataToCells': t(Strings.command_undo_paste_set_record),
  'UNDO:MoveRow': t(Strings.command_undo_move_row),
};

export const commandTran = (cmd: string) => {
  return CollaCommandTran[cmd] || cmd;
};
